FROM node:16-alpine as client-build
WORKDIR /app
COPY ./client/package.json ./client/yarn.lock ./
RUN yarn
COPY ./client .
RUN yarn build

FROM mcr.microsoft.com/dotnet/sdk:6.0 as server-build
WORKDIR /src
COPY ./*.csproj ./
RUN dotnet restore
COPY . .
RUN rm -r ./client
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:6.0 as final
WORKDIR /app
COPY --from=server-build /app/publish ./
COPY --from=client-build /app/dist ./dist
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "./bug-tracker.dll"]
