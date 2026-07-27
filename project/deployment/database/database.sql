-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: crossword_labs
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `teacher_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_teacher_id_foreign` (`teacher_id`),
  CONSTRAINT `courses_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (16,'teks hikayat','materi hari ini',12,'2026-07-14 00:58:37','2026-07-14 00:58:37');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enrollments_student_id_foreign` (`student_id`),
  KEY `enrollments_course_id_foreign` (`course_id`),
  CONSTRAINT `enrollments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pdf_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `crossword_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `materials_course_id_foreign` (`course_id`),
  CONSTRAINT `materials_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_06_26_124532_create_personal_access_tokens_table',1),(5,'2026_07_05_124431_create_courses_table',1),(6,'2026_07_05_124431_create_materials_table',1),(7,'2026_07_05_124432_create_enrollments_table',1),(8,'2026_07_05_124432_create_submissions_table',1),(9,'2026_07_05_200000_add_unique_index_to_submissions',1),(10,'2026_07_11_125806_add_lifecycle_columns_to_submissions_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (4,'App\\Models\\User',3,'auth_token','0094d2b2508926fe1761778cba63e38124b28c43fdc640863bc1638db1225f4f','[\"*\"]','2026-07-13 03:26:07',NULL,'2026-07-13 02:54:23','2026-07-13 03:26:07'),(11,'App\\Models\\User',3,'auth_token','6a15537237982ac3941f872553385ffd7efbf807ce741fac3b8837e4199a3dfa','[\"*\"]','2026-07-13 06:19:40',NULL,'2026-07-13 06:04:49','2026-07-13 06:19:40'),(12,'App\\Models\\User',3,'auth_token','b0633d3781356053b21869e93d6ae9dddf2133d235b7d3482c270533ddfa64d8','[\"*\"]','2026-07-13 06:33:50',NULL,'2026-07-13 06:16:45','2026-07-13 06:33:50'),(15,'App\\Models\\User',4,'auth_token','b79ff51fefb29f2bfa4c75881cf691baef2100065c4f4a16c7d2974f51e2c5b2','[\"*\"]','2026-07-13 09:28:13',NULL,'2026-07-13 08:16:58','2026-07-13 09:28:13'),(21,'App\\Models\\User',1,'auth_token','b45ef408da69d4a2812d7883cf171c2e6bb79295b4a73c2dd134d3f757d6ce99','[\"*\"]','2026-07-13 08:42:00',NULL,'2026-07-13 08:39:28','2026-07-13 08:42:00'),(33,'App\\Models\\User',2,'auth_token','8038315f423f8f8f7f93e426094e6bfc9a4b1cf0594ffc15545bb37f3b45857f','[\"*\"]','2026-07-13 10:32:07',NULL,'2026-07-13 10:30:03','2026-07-13 10:32:07'),(36,'App\\Models\\User',2,'auth_token','a5ed8b0fb9e2114383459547dad05238d8071e3a3b75bd7f7134e73c1c49ea47','[\"*\"]','2026-07-13 12:15:02',NULL,'2026-07-13 12:12:47','2026-07-13 12:15:02'),(37,'App\\Models\\User',2,'auth_token','1878aed1e28a635e8ddc8cccc290104b5cc8ef388d34c8d8c3aef45eee5be021','[\"*\"]','2026-07-13 17:04:57',NULL,'2026-07-13 12:18:05','2026-07-13 17:04:57'),(38,'App\\Models\\User',3,'auth_token','03a83aeb0ad00b9ec0d28cfb1da5f8da87704a19ef7930f846bb602e5d093fac','[\"*\"]','2026-07-13 13:23:30',NULL,'2026-07-13 12:41:12','2026-07-13 13:23:30'),(42,'App\\Models\\User',1,'auth_token','ca9031fbc59717bfd4b2eb4cb672587df08f08bb371eb6b56b65f2e839adc9dd','[\"*\"]','2026-07-13 15:16:11',NULL,'2026-07-13 14:32:24','2026-07-13 15:16:11'),(45,'App\\Models\\User',2,'auth_token','a26717651b85a6fa0b7ba3c8d60497aaedcc0f5e141b58bf8b7a1381c7e6decb','[\"*\"]','2026-07-13 19:51:13',NULL,'2026-07-13 15:14:36','2026-07-13 19:51:13'),(52,'App\\Models\\User',2,'auth_token','f72c156ae3e03ef42698166725244e9719a8f4de8b7ffa78a736d43f7621f88b','[\"*\"]','2026-07-13 20:31:23',NULL,'2026-07-13 20:15:02','2026-07-13 20:31:23'),(55,'App\\Models\\User',2,'auth_token','7c9532bb80cb60a3f36848d8f9675c41fcf321ecf9735059006a6b1ed994350a','[\"*\"]','2026-07-13 21:20:18',NULL,'2026-07-13 21:19:10','2026-07-13 21:20:18'),(56,'App\\Models\\User',4,'auth_token','4839170a2e043716742e228cfe1a3d53464e53d76f9d55d407c8b9fe639e083c','[\"*\"]','2026-07-13 21:30:39',NULL,'2026-07-13 21:29:52','2026-07-13 21:30:39'),(63,'App\\Models\\User',12,'auth_token','69aabc0c148760540603616db117a0c1336ed6793c2666f96dc090d068e140ac','[\"*\"]','2026-07-14 00:58:39',NULL,'2026-07-14 00:57:38','2026-07-14 00:58:39'),(70,'App\\Models\\User',1,'auth_token','52ecbc2bea11403c8d344765414d0ff0449043d5e7f7fea9824db367934b6ca5','[\"*\"]','2026-07-15 00:14:31',NULL,'2026-07-14 22:51:04','2026-07-15 00:14:31'),(72,'App\\Models\\User',3,'auth_token','78d3a25f45aa5f5c752c3bee9c7c16c0298073157fb87f13153e603b465ae3e4','[\"*\"]','2026-07-14 22:56:35',NULL,'2026-07-14 22:56:34','2026-07-14 22:56:35'),(73,'App\\Models\\User',1,'auth_token','e51d9b2fe073b3d2510ae882cb4e0a430f16a7a5eddccbad18e7c6f88c9da78c','[\"*\"]','2026-07-14 22:58:32',NULL,'2026-07-14 22:58:20','2026-07-14 22:58:32'),(77,'App\\Models\\User',12,'auth_token','734fd6baa06ee812b97d0546bc3bd23f164b12980e31283df6d492a035cee402','[\"*\"]','2026-07-15 00:07:07',NULL,'2026-07-15 00:06:57','2026-07-15 00:07:07'),(79,'App\\Models\\User',1,'auth_token','575e78a3e0e58cb0290eebee9197e27ff30431adaf87ce7ca9976a44143e9e44','[\"*\"]','2026-07-15 00:11:05',NULL,'2026-07-15 00:11:04','2026-07-15 00:11:05'),(80,'App\\Models\\User',12,'auth_token','f1dff0f4ca5d23b4719ab148ef097564ad46571dbaa6eb530ba26984fac81ca6','[\"*\"]','2026-07-15 01:21:29',NULL,'2026-07-15 01:19:19','2026-07-15 01:21:29'),(81,'App\\Models\\User',1,'auth_token','73876bd1e3253a46e0866ada53dc327c423cf778e1530cbd597f9db956f01983','[\"*\"]','2026-07-15 03:51:08',NULL,'2026-07-15 03:51:08','2026-07-15 03:51:08'),(82,'App\\Models\\User',1,'auth_token','9f19e3a7adce097b38ca9acfe2080bddfb6dbb358bd228456238f26d50e327c0','[\"*\"]','2026-07-15 03:52:44',NULL,'2026-07-15 03:52:44','2026-07-15 03:52:44'),(83,'App\\Models\\User',1,'auth_token','bfcc7d605aa7f0cf281ddda8a2d8bd121b3bf6e4e7dc0faa901e407feda27204','[\"*\"]','2026-07-15 05:55:32',NULL,'2026-07-15 04:54:52','2026-07-15 05:55:32'),(84,'App\\Models\\User',1,'auth_token','dbd9095f63c48a1d496dc85186c88c5be5797cca3a64126a6358e636b791c474','[\"*\"]','2026-07-18 21:59:33',NULL,'2026-07-18 21:57:05','2026-07-18 21:59:33'),(85,'App\\Models\\User',1,'auth_token','90c2823c599a29cb95fb7d30f868c23cd7e4d2212969de7f480eb7dd6c4ee15d','[\"*\"]','2026-07-19 09:57:06',NULL,'2026-07-19 06:14:38','2026-07-19 09:57:06');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('1pMePnbG1SQgwAQsYmWq346N1Ic7Bxg1TGt5F5w8',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJ5N0loSmRCYVB6SGFPY0JiS0hoM2lhQnpRaTdzV1hJMHhHOUhvcVhWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2Nvcm5lbGwtcHJvdGVjdGVkLXN1YnNlcXVlbnRseS12YXJpYWJsZXMudHJ5Y2xvdWRmbGFyZS5jb20iLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1783953781),('4pYQqMA9nZ4NhNQGz60d3WkgrCSqwnz4rRGSNuRG',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiI5dDlyWlpZVm40d2dLSnhBUGJrYU9lYXU3eTJCN3I4dU1DWUJRU050IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1783968634),('7uVd9XygH85cH8tCetVM4No8cEpvExUhliNkI8dY',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiIwNm9OZ2pKcXI5aXBtVEZReFpFN29VdEszenBoV004VHV3ck5Kd24yIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3BpY2tzLWluY29ycG9yYXRlLXBsdW1iaW5nLWF0dHJpYnV0ZXMudHJ5Y2xvdWRmbGFyZS5jb20iLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784112556),('9sxAbTucyxTEBLTBTF8nWS310FeLdOIudpbgxyZK',NULL,'127.0.0.1','curl/8.20.0','eyJfdG9rZW4iOiJVOGx1QUlNb0FEZ096YkppZHdRWlFUbndqYlZpSEhSVU42OGE0SjlZIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1783953532),('bpULZcbMpoL5HDFR8YnuwAJBFXX6mUOwqUliaEeM',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiI0dGFaRlljZERRdWtKejY0czZjVTNaNUhscnM3MDRvTEh5UVRnanFlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784436649),('FcxZtQiFWyD5VwdyY0Bq1psMi1eqaITmeBOpuCVX',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJZazBPU3JFazU1STFxQWlLb29udkVsaG9WR3NmRExnN2tXYkhoMm15IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2hvcGVkLWVudGlyZWx5LXRyaXZpYS1yZWNvcmRpbmdzLnRyeWNsb3VkZmxhcmUuY29tIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784464550),('fokBdp5hyMIiXaAj5In4ExMw6IvTRId8XdHTu14s',NULL,'127.0.0.1','curl/8.20.0','eyJfdG9rZW4iOiJwaW5PTkloOXFWcmh4RW5uN0pndGZBUnNSa2xVb0taWDRvc2kyNmFNIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1783953602),('hAeXHZ2MtX5cgaoMiC6pCuTuiyo4piQscqIhZjCi',NULL,'127.0.0.1','curl/8.20.0','eyJfdG9rZW4iOiJRZXNTbUJwTnZoNVkxcUw5N2JKMTNERXRhY0l6OE9JTjBIZlVpdEZWIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1783953621),('hbnCiBvAMd8bUx1bN24DZK808GB4S7BhyGN99kbn',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJpdHd3dGFYem14S256em94QzhJUzJSZ3dGNlU5RzFMU1Rwb296TEtqIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2Nvcm5lbGwtcHJvdGVjdGVkLXN1YnNlcXVlbnRseS12YXJpYWJsZXMudHJ5Y2xvdWRmbGFyZS5jb20iLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1783954856),('LpCzuEQESfVfC4HV82h5guzTMlitS8stsLPXhjYn',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJpS0VXWkp1S1Z2dlIzMUFFQ1RrZUxvRFVESHcyS0NGeE5wSktyeDFqIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2Nvcm5lbGwtcHJvdGVjdGVkLXN1YnNlcXVlbnRseS12YXJpYWJsZXMudHJ5Y2xvdWRmbGFyZS5jb20iLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1783953898),('NrA767Sqfyd1ZUGGXcoWlqad3iYJ6u6C8cYxY81I',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJScE5HakdpWEVSdXY0ZmY4enp3Q1Q4ekpEbGhGYjJYOVNxenZ0UFAxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2ZhbW91cy1jb25zdHJhaW50LXJlc2VydmF0aW9uLXJ1c3NlbGwudHJ5Y2xvdWRmbGFyZS5jb20iLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1784436523),('oUTzCRxo9gyRa2H8m8mXdmzkf99denQUYk1PKLfE',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJoQUNtMFBDanpRTjlVczk4aE1va1ZlVzFBdDdQVFc0NGxIa3pjTTNMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1783953044),('sN6xErsVNhAPm5r8K5PtUGCaEaHnNkKpzQJxv4la',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJBY3B4VmhrWDF6ejA2ajBLMUNqV0VGa1Y5TmcxY3BzR1RieFlKaEhBIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2RhbGUtaGF0cy1maWd1cmVzLW1scy50cnljbG91ZGZsYXJlLmNvbSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1784092662),('tgZD9wzMX1FkLKQSrBQO7yXW8KYupyPzyW7avmdn',NULL,'127.0.0.1','curl/8.20.0','eyJfdG9rZW4iOiI0ZmVWRDA0bjBPVjJoY0FraVlDa1JvZ25KWnp6WDZHaUdnNnpwdUFkIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL3Rlc3QudHJ5Y2xvdWRmbGFyZS5jb20iLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=',1783953574),('TTkZ3kDXNnq2OAph3ETKnN3CoiT8uFw15gPytvat',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJ6TUhycnMyV01uRTVadTZLNHNWb1FvQmk2Wlk5dVpxZnZ1bVpyTzlyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2NhcmVmdWxseS1yZWdhcmRzLWpvaW4tYWNuZS50cnljbG91ZGZsYXJlLmNvbSIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==',1783997469),('uScFsFPugoGJDrYiSdsCoMiEoR25o0ngvB0C6J1x',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJJQXBNUGdoWnprOXB5ZVREME5EOVAzcVVYSVN1bVVOYU00ek1UMnFmIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2hvcGVkLWVudGlyZWx5LXRyaXZpYS1yZWNvcmRpbmdzLnRyeWNsb3VkZmxhcmUuY29tIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784464550),('VmYzDGLXgyPeoYu32fC9AR43kIyZjw6bjJIvXW4u',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiJzNHhFU0EybnF4a2FsdG93dzBJT2g2QlZpbXY0ZlBNU1kzVnFDZEdTIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL29yZ2FuaXppbmctdGVycmFjZS1maWZ0ZWVuLW1vdG9yLnRyeWNsb3VkZmxhcmUuY29tIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1784466396),('xCYy3Zdr7V7pM0QcLUKlw95kUkJusfSju4vkCvNt',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36 Edg/150.0.0.0','eyJfdG9rZW4iOiI2ak1vYmQyWlRkSXZ4OWlmNUlCWlRuaGk0SnA0ajhhZUFVVFFmOEU1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL21hcmlseW4tYmlibGUtY29yZS1ib2F0LnRyeWNsb3VkZmxhcmUuY29tIiwicm91dGUiOm51bGx9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19',1783953321);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `material_id` bigint unsigned NOT NULL,
  `score` int NOT NULL DEFAULT '0',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `started_at` timestamp NULL DEFAULT NULL,
  `reading_finished_at` timestamp NULL DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `correct_answers` int NOT NULL DEFAULT '0',
  `wrong_answers` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `submissions_student_material_unique` (`student_id`,`material_id`),
  KEY `submissions_material_id_foreign` (`material_id`),
  CONSTRAINT `submissions_material_id_foreign` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submissions_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','teacher','student') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Admin','admin@example.com',NULL,'$2y$12$UG6.GV7JWWvuJuoz6RoNceKA1a6mdakEFrATLT0YNW4ucNVWAtJhm','admin','approved',NULL,'2026-07-13 02:10:20','2026-07-13 02:10:20'),(3,'Student 1','student1@example.com',NULL,'$2y$12$2e1hIAv6NhEGADwFlI3FR.xzKzxO4rMUPwsk3PKu.6zcsC0Zz..bW','student','approved',NULL,'2026-07-13 02:10:21','2026-07-13 02:10:21'),(12,'Putri khairani','putri@gmail.com',NULL,'$2y$12$pYLj71HhWoJU6iQldCEdPu5SnM1S128uTLhuV3m.lr/OkgnjQ83fi','teacher','approved',NULL,'2026-07-14 00:52:49','2026-07-14 00:52:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-26 20:34:47
