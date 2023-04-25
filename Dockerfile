FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5018
EXPOSE 5018

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Buegee.csproj", "."]
RUN dotnet restore "./Buegee.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Buegee.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Buegee.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Buegee.dll"]
