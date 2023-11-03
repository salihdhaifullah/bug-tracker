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
COPY --from=client-build /app/dist ./dist
COPY --from=build /src/Emails ./Emails
RUN rm -r -f ./Client
ENV ASPNETCORE_URLS=http://+:5018
ENTRYPOINT ["dotnet", "Buegee.dll"]
