FROM node:18-alpine as client-build
WORKDIR /app
COPY ./Client/package.json ./Client/yarn.lock ./
RUN yarn
COPY ./Client .
RUN yarn build

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5018

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Server/Buegee.csproj", "Server/"]
RUN dotnet restore "./Server/Buegee.csproj"
COPY ./Server .
WORKDIR "/src/."
RUN dotnet build "Buegee.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "Buegee.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY ./ .
COPY --from=publish /app/publish .
COPY --from=client-build /app/dist ./dist
RUN rm -r -f ./Client
RUN rm -r -f ./Server
ENV ASPNETCORE_URLS=http://+:5018
ENTRYPOINT ["dotnet", "Buegee.dll"]
