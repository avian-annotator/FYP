# Step 1: Build the application using Maven
FROM maven:3.9.9-amazoncorretto-21 AS build

# Set the working directory
WORKDIR /app

# Copy your pom.xml to cache the dependencies
COPY pom.xml .

# Download the dependencies (it will be cached if dependencies don't change)
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application (skip tests for faster build)
RUN mvn clean package -DskipTests

# Step 2: Use OpenJDK 21 to run the application
FROM amazoncorretto:21

# Set the working directory
WORKDIR /app

# Copy the packaged JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the default application port (8080)
EXPOSE 8080

# Expose the debug port (5005) for remote debugging
EXPOSE 5005


ENTRYPOINT [ "java", "-jar", "app.jar" ]
# Start the application with remote debugging enabled
# ENTRYPOINT ["java", "-Xdebug", "-Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=n", "-jar", "app.jar"]