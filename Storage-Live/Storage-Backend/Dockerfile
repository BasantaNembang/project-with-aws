FROM maven:3.9.5-eclipse-temurin-17 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests


FROM eclipse-temurin:17-jdk-jammy

WORKDIR /

RUN apt-get update && apt-get install -y ffmpeg

COPY --from=builder /app/target/*.jar /app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]


