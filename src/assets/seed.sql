CREATE TABLE IF NOT EXISTS access(
    AccessID TEXT PRIMARY KEY NOT NULL,
    Access TEXT NOT NULL
);
INSERT OR IGNORE INTO access VALUES ('AC01','Update, Delete');
INSERT OR IGNORE INTO access VALUES ('AC02','View');

CREATE TABLE IF NOT EXISTS asset(
  AssetID TEXT NOT NULL PRIMARY KEY,
  Satus TEXT NOT NULL,
  GPSLatitude TEXT NOT NULL,
  GPSLongitude TEXT NOT NULL,
  Region TEXT NOT NULL,
  Division TEXT NOT NULL,
  SubDivision TEXT NOT NULL,
  NearestMilePost TEXT NOT NULL,
  LastTestedDate TEXT NOT NULL
);

INSERT OR IGNORE INTO asset (AssetID, Satus, GPSLatitude, GPSLongitude, Region, Division, SubDivision, NearestMilePost, LastTestedDate)
VALUES
('A101', 'Functions', '40.741895', '-73.989308', 'NY', 'Manhatten', 'Bronx', 'MP251', '2019-08-14 00:00:00'),
('A102', 'Functions', '40.96418572610003', '-76.5923811201172', 'PA', 'Mechanicsville', 'Brook Avenue', 'MP211', '2018-09-12 03:16:39'),
('A103', 'Not functioning', '39.283157046013734', '-80.50712966683095', 'WV', 'Lake Floyd', 'Country route', 'MP511', '2018-01-24 07:36:06');

-- -- role --
CREATE TABLE IF NOT EXISTS role (
    RoleID TEXT PRIMARY KEY NOT NULL,
    Title TEXT NOT NULL,
    CreatedDate TEXT NOT NULL,
    UpdatedDate TEXT DEFAULT NULL,
    DeletedDate TEXT DEFAULT NULL
);

INSERT OR IGNORE INTO role (RoleID,Title,CreatedDate,UpdatedDate,DeletedDate)
VALUES
('R101', 'Supervisor', '2018-09-12 06:24:04', NULL, NULL),
('R102', 'Inspector', '2019-05-16 16:16:23', '2019-10-25 03:52:31', NULL),
('R103', 'Engineer', '2018-08-15 07:29:21', NULL, NULL);

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS user (
    UserID TEXT PRIMARY KEY NOT NULL,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    Password TEXT NOT NULL,
    Region TEXT NOT NULL,
    RoleID TEXT NOT NULL
    ,
    CONSTRAINT user_ibfk_1 FOREIGN KEY (RoleID) REFERENCES role (RoleID)
);

INSERT INTO user (UserID,Name,Email,Password,Region,RoleID)
VALUES
('EMP101', 'Edith Franco', 'Edith.F@Martis.com', '$2b$10$XiczolHXWQIYIvfHR4XCk.WRMMNkBKejohH3NwWeGdheQToZrJ3KC', 'CAL', 'R102'),
('EMP102', 'Sofie Andrew', 'Sofie.A@Martis.com', '$2b$10$skJne7h0YrStWOGPHutEhuCrQQbFWmuh.55GYSYWsjYK2XfWuajJG', 'CAL', 'R101'),
('EMP103', 'Eren Johns', 'Eren.J@Martis.com', '$2b$10$XGAJtiLV5/TrVEYBNC6axO2vYsjbiYXAsoAShOP3UvH7YCQYO69C2', 'NY', 'R101'),
('EMP104', 'Nyle Franklin', 'Nyle.F@Martis.com', '$2b$10$hG9goEpz.q4bwICgMn0JH.XeWiUNN4059SqOwXEiFsbjqyz4z1JYy', 'TX', 'R103'),
('EMP105', 'Robson Eaton', 'Robson.E@Martis.com', '$2b$10$YCQ92k1H6FfgJZMuJou2Quo1e5kcafyX0taibfxqztk.Scxfo4AKW', 'NC', 'R103');


-- --device ---
CREATE TABLE IF NOT EXISTS device(
    DeviceID TEXT PRIMARY KEY NOT NULL,
    UserID TEXT KEY NOT NULL,
    PIN TEXT NOT NULL,
    CONSTRAINT device_ibfk_1 FOREIGN KEY (UserID) REFERENCES user(UserID)
);

INSERT OR IGNORE INTO device (DeviceID, UserID, PIN) VALUES
('D101', 'EMP101', '8426'),
('D102', 'EMP102', '6248'),
('D103', 'EMP103', '7946'),
('D104', 'EMP104', '4613'),
('D105', 'EMP105', '1234');

CREATE TABLE IF NOT EXISTS repair(
    EngineerID TEXT DEFAULT NULL,
    AssetID TEXT KEY NOT NULL,
    CreatedDate TEXT NOT NULL,
    CompletedDate TEXT NOT NULL,
    comments VARCHAR(100) NOT NULL,
    PRIMARY KEY (AssetID, CreatedDate),
    CONSTRAINT repair_ibfk_2 FOREIGN KEY (EngineerID)
    REFERENCES user(UserID),
    CONSTRAINT repair_ibfk_1 FOREIGN KEY (AssetID) REFERENCES asset(AssetID)
);

INSERT OR IGNORE INTO repair (EngineerID, AssetID, CreatedDate, CompletedDate, comments)
VALUES
('EMP105', 'A101', '2020-04-17 23:16:38', NULL, ''),
(NULL, 'A101', '2020-11-15 16:38:55', NULL, ''),
('EMP101', 'A102', '2020-06-18 08:24:40', NULL, '');


-- --
-- -- Table structure for table `roleaccess`
-- --

CREATE TABLE IF NOT EXISTS roleaccess(
    RoleID TEXT NOT NULL,
    AccessID TEXT NOT NULL,
    CreatedDate TEXT NOT NULL,
    UpdatedDate TEXT DEFAULT NULL,
    DeletedDate TEXT DEFAULT NULL,
    PRIMARY KEY (RoleID, AccessID),
    CONSTRAINT roleaccess_ibfk_1 FOREIGN KEY (RoleID) REFERENCES role(RoleID),
    CONSTRAINT roleaccess_ibfk_2 FOREIGN KEY (AccessID) REFERENCES access(AccessID)
);

INSERT OR IGNORE INTO roleaccess (RoleID,AccessID,CreatedDate,UpdatedDate,DeletedDate)
VALUES
('R101', 'A101', '2019-11-22 07:20:15', NULL, NULL),
('R102', 'A101', '2019-12-27 12:13:30', NULL, NULL),
('R103', 'A101', '2019-09-13 00:00:00', NULL, '2020-06-24 06:24:33'),
('R103', 'A102', '2020-01-24 05:19:29', '2020-04-17 07:22:09', NULL);

-- --
-- -- Table structure for table `testmodule`
-- --

CREATE TABLE IF NOT EXISTS testmodule (
    TestModID TEXT PRIMARY KEY NOT NULL,
    SupervisorID TEXT NOT NULL,
    Description TEXT NOT NULL
    ,
    CONSTRAINT testmodule_ibfk_1 FOREIGN KEY (SupervisorID) REFERENCES user (UserID)
);

INSERT OR IGNORE INTO testmodule (TestModID,SupervisorID,Description)
VALUES
('TM101', 'EMP102', 'Check Lights'),
('TM102', 'EMP105', 'Check Energy source');



--
-- Table structure for table `test`
--

CREATE TABLE IF NOT EXISTS test (
    TestID TEXT PRIMARY KEY NOT NULL,
    DateIssued TEXT NOT NULL,
    AssetID TEXT NOT NULL,
    InspectorID TEXT NOT NULL,
    Result TEXT NOT NULL,
    SupervisorID TEXT NOT NULL,
    DateCompleted TEXT DEFAULT NULL,
    Frequency INTEGER NOT NULL,
    Urgent INTEGER NOT NULL,
    TestModID TEXT NOT NULL,
    comments TEXT NOT NULL
    ,
    CONSTRAINT test_ibfk_1 FOREIGN KEY (AssetID) REFERENCES asset(AssetID),
    CONSTRAINT test_ibfk_2 FOREIGN KEY (InspectorID) REFERENCES user(UserID),
    CONSTRAINT test_ibfk_3 FOREIGN KEY (SupervisorID) REFERENCES user (UserID),
    CONSTRAINT test_ibfk_4 FOREIGN KEY (TestModID) REFERENCES testmodule (TestModID)
);

INSERT OR IGNORE INTO test (TestID,DateIssued, AssetID, InspectorID,Result,SupervisorID,DateCompleted,Frequency,Urgent,TestModID,comments)
VALUES
('T101', '2019-09-20 08:25:04', 'A102', 'EMP104', 'Completed', 'EMP105', '2020-07-16 19:13:09', 2, 0, 'TM102', ''),
('T102', '2020-04-23 01:17:28', 'A103', 'EMP101', 'Pending', 'EMP103', NULL, 1, 1, 'TM101', ''),
('T103', '2020-03-19 00:00:00', 'A102', 'EMP104', 'Pending', 'EMP102', NULL, 3, 0, 'TM102', ''),
('T104', '2020-07-16 19:13:09', 'A102', 'EMP101', 'Pass', 'EMP102', '2020-05-26 09:45:09', 1, 1, 'TM102', '');

--
-- Triggers test
--

-- CREATE TRIGGER IF NOT EXISTS CreateNewRepair 
-- AFTER INSERT 
-- ON test 
-- FOR EACH ROW 
-- BEGIN
--     INSERT INTO repair (AssetID, CreatedDate)
--     VALUES ("@AssetID", NOW());
-- END;

