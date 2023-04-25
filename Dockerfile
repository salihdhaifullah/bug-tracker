FROM node:18-alpine as tailwind-css-build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run minify

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
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
COPY --from=tailwind-css-build /app/wwwroot/css/site.css /app/wwwroot/css/site.css
RUN rm -rf package.json
RUN rm -rf package-lock.json
RUN rm -rf wwwroot/css/input.css
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5018
ENTRYPOINT ["dotnet", "Buegee.dll"]
