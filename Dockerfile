FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
COPY --from=build /app/target/connekt-0.0.1-SNAPSHOT.jar connekt.jar

ENTRYPOINT ["java", "-jar", "connekt.jar"]

EXPOSE 8080