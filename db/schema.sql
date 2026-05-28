-- Create the schema
CREATE DATABASE IF NOT EXISTS health_ai;
USE health_ai;

-- Table for storing user demographics
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Age INT,
    Gender VARCHAR(10),
    LanguagePreference VARCHAR(20),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a default demo user
INSERT INTO Users (Name, Age, Gender, LanguagePreference) VALUES ('Demo User', 30, 'Male', 'English');

-- Table for logging the AI scan results to build the preventive history
CREATE TABLE IF NOT EXISTS HealthLogs (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    ScanType VARCHAR(50), -- e.g., 'EyeScan', 'CoughAudio', 'Combined'
    ResultScore DECIMAL(5,2),
    RiskCategory VARCHAR(20), -- e.g., 'Low', 'Moderate', 'High'
    Findings TEXT,
    ScanDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
