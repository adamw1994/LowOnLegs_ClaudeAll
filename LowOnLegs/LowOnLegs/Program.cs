
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

            builder.Services.AddSingleton<IMatchStateManager, MatchStateManager>();
            builder.Services.AddScoped<IMatchService, MatchService>();
            builder.Services.AddScoped<IPlayerService, PlayerService>();
            builder.Services.AddScoped<IPlayerRepository, PlayerRepository>();
            builder.Services.AddScoped<IMatchRepository, MatchRepository>();

            var app = builder.Build();

            // Apply pending EF Core migrations automatically on startup
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.Database.Migrate();
            }

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            // UseCors must come before MapControllers and MapHub
            app.UseCors("CorsPolicy");

            app.UseAuthorization();

            app.MapControllers();

            app.MapHub<ScoreboardHub>("/scoreboardhub");

            app.Run();
        }
    }
}
