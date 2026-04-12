using LowOnLegs.API.Hubs;
using LowOnLegs.Core.Interfaces;
using LowOnLegs.Data;
using LowOnLegs.Data.Repositories;
using LowOnLegs.Data.Repositories.Interfaces;
using LowOnLegs.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace LowOnLegs
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            builder.Services.AddOpenApi();

            var allowedOrigins = builder.Configuration
                .GetSection("Cors:AllowedOrigins")
                .Get<string[]>() ?? [];

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            builder.Services.AddSignalR();

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Singletons (in-memory state)
            builder.Services.AddSingleton<IMatchStateManager, MatchStateManager>();
            builder.Services.AddSingleton<IDoubleMatchStateManager, DoubleMatchStateManager>();

            // Scoped services
            builder.Services.AddScoped<IMatchService, MatchService>();
            builder.Services.AddScoped<IDoubleMatchService, DoubleMatchService>();
            builder.Services.AddScoped<IPlayerService, PlayerService>();
            builder.Services.AddScoped<IStatsService, StatsService>();

            // Repositories
            builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
            builder.Services.AddScoped<IMatchRepository, MatchRepository>();
            builder.Services.AddScoped<IDoubleMatchRepository, DoubleMatchRepository>();

            var app = builder.Build();

            // Apply pending EF Core migrations automatically
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.Database.Migrate();
            }

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            // Serve uploaded player photos from /app/data/uploads/
            var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
            Directory.CreateDirectory(uploadsPath);
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
                RequestPath = "/uploads"
            });

            app.UseCors("CorsPolicy");
            app.UseAuthorization();
            app.MapControllers();
            app.MapHub<ScoreboardHub>("/scoreboardhub");

            app.Run();
        }
    }
}
