# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files first for layer caching of dotnet restore
COPY ["LowOnLegs/LowOnLegs.API.csproj", "LowOnLegs/"]
COPY ["LowOnLegs.Core/LowOnLegs.Core.csproj", "LowOnLegs.Core/"]
COPY ["LowOnLegs.Data/LowOnLegs.Data.csproj", "LowOnLegs.Data/"]
COPY ["LowOnLegs.Infrastructure/LowOnLegs.Infrastructure.csproj", "LowOnLegs.Infrastructure/"]
COPY ["LowOnLegs.Services/LowOnLegs.Services.csproj", "LowOnLegs.Services/"]
RUN dotnet restore "./LowOnLegs/LowOnLegs.API.csproj"

# Copy all source files and build
COPY . .
WORKDIR "/src/LowOnLegs"
RUN dotnet build "./LowOnLegs.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./LowOnLegs.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LowOnLegs.API.dll"]
