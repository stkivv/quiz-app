FROM maven:3.9.9-amazoncorretto-21 AS build
COPY pom.xml .
COPY src ./src
RUN mvn clean package

FROM amazoncorretto:21-alpine
COPY --from=build ./target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
