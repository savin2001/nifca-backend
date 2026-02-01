CREATE DATABASE  IF NOT EXISTS `nifca` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `nifca`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nifca
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application_audit_log`
--

DROP TABLE IF EXISTS `application_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_audit_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `performed_by` int NOT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  KEY `performed_by` (`performed_by`),
  CONSTRAINT `application_audit_log_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`),
  CONSTRAINT `application_audit_log_ibfk_2` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_audit_log`
--

LOCK TABLES `application_audit_log` WRITE;
/*!40000 ALTER TABLE `application_audit_log` DISABLE KEYS */;
INSERT INTO `application_audit_log` VALUES (4,9,'review',42,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"under_review\", \"reviewed_by\": 42, \"review_comments\": \"Application is under review. Additional documents may be requested.\"}','2026-01-29 20:17:48'),(5,10,'review',42,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"under_review\", \"reviewed_by\": 42, \"review_comments\": \"Application is under review. Additional documents may be requested.\"}','2026-01-29 20:17:48'),(6,10,'status_change',42,'{\"status\": \"under_review\"}','{\"status\": \"approved\"}','2026-01-29 20:17:48'),(7,12,'status_change',42,'{\"status\": \"draft\"}','{\"status\": \"approved\"}','2026-01-29 20:18:28'),(8,14,'status_change',42,'{\"status\": \"draft\"}','{\"status\": \"approved\"}','2026-01-29 20:19:25'),(9,16,'status_change',42,'{\"status\": \"draft\"}','{\"status\": \"approved\"}','2026-01-29 20:20:05'),(10,23,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"approved\", \"reviewed_by\": 55, \"review_comments\": \"Approved\"}','2026-01-31 19:40:23'),(11,9,'review',55,'{\"status\": \"under_review\", \"reviewed_by\": 42, \"review_comments\": \"Application is under review. Additional documents may be requested.\"}','{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"test\"}','2026-01-31 20:01:35'),(12,9,'review',55,'{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"test\"}','{\"status\": \"rejected\", \"reviewed_by\": 55, \"review_comments\": \"rejected\"}','2026-01-31 20:02:08'),(13,30,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"rejected\", \"reviewed_by\": 55, \"review_comments\": \"no\"}','2026-01-31 22:22:34'),(14,18,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"approved\", \"reviewed_by\": 55, \"review_comments\": \"okay\"}','2026-01-31 22:53:29'),(15,35,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"Checking valid docs\"}','2026-02-01 13:30:24'),(16,35,'review',55,'{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"Checking valid docs\"}','{\"status\": \"pending\", \"reviewed_by\": 55, \"review_comments\": \"Add support documents missing\"}','2026-02-01 13:43:57'),(17,35,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": 55, \"review_comments\": \"Add support documents missing\"}','{\"status\": \"approved\", \"reviewed_by\": 55, \"review_comments\": \"All good. Welcome to Kenya\"}','2026-02-01 14:25:27');
/*!40000 ALTER TABLE `application_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_documents`
--

DROP TABLE IF EXISTS `application_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `section_id` int DEFAULT NULL,
  `field_id` int DEFAULT NULL,
  `document_type` varchar(100) DEFAULT NULL COMMENT 'Category of document (e.g., "ID Document", "Financial Statement")',
  `original_filename` varchar(255) NOT NULL,
  `stored_filename` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `file_size` int NOT NULL COMMENT 'File size in bytes',
  `uploaded_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  KEY `field_id` (`field_id`),
  KEY `idx_documents_application` (`application_id`),
  KEY `fk_uploaded_by_client` (`uploaded_by`),
  CONSTRAINT `application_documents_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_documents_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `application_sections` (`id`) ON DELETE SET NULL,
  CONSTRAINT `application_documents_ibfk_3` FOREIGN KEY (`field_id`) REFERENCES `section_fields` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_uploaded_by_client` FOREIGN KEY (`uploaded_by`) REFERENCES `clients` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_documents`
--

LOCK TABLES `application_documents` WRITE;
/*!40000 ALTER TABLE `application_documents` DISABLE KEYS */;
INSERT INTO `application_documents` VALUES (2,18,5,11,'certificate_of_incorporation','test_doc.pdf','doc_jw8ufg_1769792524232.pdf','assets/applications/18/doc_jw8ufg_1769792524232.pdf','application/pdf',44,13,'2026-01-30 20:02:04'),(3,18,5,12,'memorandum_articles','test_doc.pdf','doc_b6ppuh_1769792540806.pdf','assets/applications/18/doc_b6ppuh_1769792540806.pdf','application/pdf',44,13,'2026-01-30 20:02:20'),(4,18,5,13,'business_plan','test_doc.pdf','doc_dp98xo_1769792542989.pdf','assets/applications/18/doc_dp98xo_1769792542989.pdf','application/pdf',44,13,'2026-01-30 20:02:22'),(5,18,5,14,'financial_projections','test_doc.pdf','doc_qih0oz_1769792545192.pdf','assets/applications/18/doc_qih0oz_1769792545192.pdf','application/pdf',44,13,'2026-01-30 20:02:25'),(6,20,5,NULL,NULL,'The Immaculate Foundation.pdf','doc_cs5pgc_1769793476581.pdf','assets/applications/20/doc_cs5pgc_1769793476581.pdf','application/pdf',52128,13,'2026-01-30 20:17:56'),(7,21,5,NULL,NULL,'Certificate.pdf','doc_wot1um_1769794200565.pdf','assets/applications/21/doc_wot1um_1769794200565.pdf','application/pdf',52128,13,'2026-01-30 20:30:00'),(8,23,5,11,'certificate_of_incorporation','Certificate Inco.pdf','doc_r6poax_1769876911676.pdf','assets/applications/23/doc_r6poax_1769876911676.pdf','application/pdf',52128,13,'2026-01-31 19:28:31'),(9,23,5,12,'memorandum_articles','Memo.pdf','doc_1ziirj_1769876930205.pdf','assets/applications/23/doc_1ziirj_1769876930205.pdf','application/pdf',52128,13,'2026-01-31 19:28:50'),(10,23,5,13,'business_plan','Business Plan.pdf','doc_qc0j13_1769876952717.pdf','assets/applications/23/doc_qc0j13_1769876952717.pdf','application/pdf',52128,13,'2026-01-31 19:29:12'),(11,23,5,14,'financial_projections','Projections.pdf','doc_v7vhhb_1769876965498.pdf','assets/applications/23/doc_v7vhhb_1769876965498.pdf','application/pdf',52128,13,'2026-01-31 19:29:25'),(12,23,5,15,'additional_documents','MOU.pdf','doc_w1s3f1_1769876984696.pdf','assets/applications/23/doc_w1s3f1_1769876984696.pdf','application/pdf',52128,13,'2026-01-31 19:29:44'),(13,23,5,NULL,NULL,'Minutes.pdf','doc_2vxkr5_1769877000960.pdf','assets/applications/23/doc_2vxkr5_1769877000960.pdf','application/pdf',52128,13,'2026-01-31 19:30:00'),(14,27,5,11,'certificate_of_incorporation','NIFCA_Application_NIFCA-2026-00023.pdf','doc_kdx357_1769883614213.pdf','assets/applications/27/doc_kdx357_1769883614213.pdf','application/pdf',42106,13,'2026-01-31 21:20:14'),(15,27,5,12,'memorandum_articles','NIFCA_Application_NIFCA-2026-00023.pdf','doc_0apgef_1769883619658.pdf','assets/applications/27/doc_0apgef_1769883619658.pdf','application/pdf',42106,13,'2026-01-31 21:20:19'),(16,27,5,13,'business_plan','NIFCA_Application_NIFCA-2026-00023.pdf','doc_ufzkam_1769883625108.pdf','assets/applications/27/doc_ufzkam_1769883625108.pdf','application/pdf',42106,13,'2026-01-31 21:20:25'),(17,27,5,14,'financial_projections','NIFCA_Application_NIFCA-2026-00023.pdf','doc_gba5s7_1769883634333.pdf','assets/applications/27/doc_gba5s7_1769883634333.pdf','application/pdf',42106,13,'2026-01-31 21:20:34'),(18,27,5,15,'additional_documents','NIFCA_Application_NIFCA-2026-00023.pdf','doc_941zb8_1769883640529.pdf','assets/applications/27/doc_941zb8_1769883640529.pdf','application/pdf',42106,13,'2026-01-31 21:20:40'),(19,27,5,NULL,NULL,'NIFCA_Application_NIFCA-2026-00023.pdf','doc_5mkgbl_1769883646338.pdf','assets/applications/27/doc_5mkgbl_1769883646338.pdf','application/pdf',42106,13,'2026-01-31 21:20:46'),(20,27,5,NULL,NULL,'NIFCA_Application_NIFCA-2026-00023.pdf','doc_ag2sr0_1769883668826.pdf','assets/applications/27/doc_ag2sr0_1769883668826.pdf','application/pdf',42106,13,'2026-01-31 21:21:08'),(21,30,5,11,'certificate_of_incorporation','cert.pdf','doc_xkao6w_1769885468928.pdf','assets/applications/30/doc_xkao6w_1769885468928.pdf','application/pdf',42106,13,'2026-01-31 21:51:08'),(22,30,5,12,'memorandum_articles','memo.pdf','doc_w7fuv4_1769885475188.pdf','assets/applications/30/doc_w7fuv4_1769885475188.pdf','application/pdf',42106,13,'2026-01-31 21:51:15'),(23,30,5,13,'business_plan','business.pdf','doc_mqmkjj_1769885483430.pdf','assets/applications/30/doc_mqmkjj_1769885483430.pdf','application/pdf',42106,13,'2026-01-31 21:51:23'),(24,30,5,14,'financial_projections','projection.pdf','doc_ql5pat_1769885497865.pdf','assets/applications/30/doc_ql5pat_1769885497865.pdf','application/pdf',42106,13,'2026-01-31 21:51:37'),(25,30,5,15,'additional_documents','support1.pdf','doc_8u2gk1_1769885503308.pdf','assets/applications/30/doc_8u2gk1_1769885503308.pdf','application/pdf',42106,13,'2026-01-31 21:51:43'),(26,30,5,NULL,NULL,'support2.pdf','doc_hkjtez_1769885510273.pdf','assets/applications/30/doc_hkjtez_1769885510273.pdf','application/pdf',42106,13,'2026-01-31 21:51:50'),(27,30,5,NULL,NULL,'minutes.pdf','doc_n7a44t_1769885518207.pdf','assets/applications/30/doc_n7a44t_1769885518207.pdf','application/pdf',42106,13,'2026-01-31 21:51:58'),(28,35,5,11,'certificate_of_incorporation','cert.pdf','doc_g2gu00_1769940910015.pdf','assets/applications/35/doc_g2gu00_1769940910015.pdf','application/pdf',42106,13,'2026-02-01 13:15:10'),(29,35,5,12,'memorandum_articles','memo.pdf','doc_dviax0_1769940916537.pdf','assets/applications/35/doc_dviax0_1769940916537.pdf','application/pdf',42106,13,'2026-02-01 13:15:16'),(30,35,5,13,'business_plan','business.pdf','doc_cgoo41_1769940922961.pdf','assets/applications/35/doc_cgoo41_1769940922961.pdf','application/pdf',42106,13,'2026-02-01 13:15:22'),(31,35,5,14,'financial_projections','projection.pdf','doc_c5rb62_1769940929265.pdf','assets/applications/35/doc_c5rb62_1769940929265.pdf','application/pdf',42106,13,'2026-02-01 13:15:29'),(32,35,5,15,'additional_documents','support1.pdf','doc_uytlqc_1769940938539.pdf','assets/applications/35/doc_uytlqc_1769940938539.pdf','application/pdf',42106,13,'2026-02-01 13:15:38');
/*!40000 ALTER TABLE `application_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_section_data`
--

DROP TABLE IF EXISTS `application_section_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_section_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `section_id` int NOT NULL,
  `field_data` json NOT NULL COMMENT 'Key-value pairs: {"field_name": "value", ...}',
  `is_complete` tinyint(1) DEFAULT '0',
  `validated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_application_section` (`application_id`,`section_id`),
  KEY `section_id` (`section_id`),
  KEY `idx_section_data_application` (`application_id`),
  CONSTRAINT `application_section_data_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `application_section_data_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `application_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_section_data`
--

LOCK TABLES `application_section_data` WRITE;
/*!40000 ALTER TABLE `application_section_data` DISABLE KEYS */;
INSERT INTO `application_section_data` VALUES (1,11,1,'{\"company_name\": \"Test Company Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2020-01-15\", \"country_of_incorporation\": \"KE\"}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(2,11,2,'{}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(3,11,3,'{}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(4,11,4,'{}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(5,12,1,'{\"company_name\": \"Admin Test Company Ltd\", \"company_type\": \"PLC\", \"registration_number\": \"XYZ-789012\", \"date_of_incorporation\": \"2019-06-20\", \"country_of_incorporation\": \"UK\"}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(6,12,2,'{}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(7,12,3,'{}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(8,12,4,'{}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(9,13,1,'{\"company_name\": \"Test Company Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2020-01-15\", \"country_of_incorporation\": \"KE\"}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(10,13,2,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(11,13,3,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(12,13,4,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(13,14,1,'{\"company_name\": \"Admin Test Company Ltd\", \"company_type\": \"PLC\", \"registration_number\": \"XYZ-789012\", \"date_of_incorporation\": \"2019-06-20\", \"country_of_incorporation\": \"UK\"}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(14,14,2,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(15,14,3,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(16,14,4,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(17,15,1,'{\"company_name\": \"Test Company Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2020-01-15\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(18,15,2,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(19,15,3,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(20,15,4,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(21,16,1,'{\"company_name\": \"Admin Test Company Ltd\", \"company_type\": \"PLC\", \"registration_number\": \"XYZ-789012\", \"date_of_incorporation\": \"2019-06-20\", \"country_of_incorporation\": \"UK\"}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(22,16,2,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(23,16,3,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(24,16,4,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(25,18,1,'{\"company_name\": \"NIFCA Test Corporation Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"KE-2026-12345\", \"date_of_incorporation\": \"2025-06-15\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-30 19:57:15','2026-01-30 19:56:04','2026-01-30 19:57:15'),(26,18,2,'{}',1,'2026-01-30 19:57:18','2026-01-30 19:56:34','2026-01-30 19:57:18'),(27,18,3,'{}',1,'2026-01-30 19:57:21','2026-01-30 19:56:37','2026-01-30 19:57:21'),(28,18,4,'{}',1,'2026-01-30 19:57:24','2026-01-30 19:56:40','2026-01-30 19:57:24'),(29,18,5,'{}',1,'2026-01-30 20:02:35','2026-01-30 19:56:43','2026-01-30 20:02:35'),(30,20,1,'{\"company_name\": \"Bazenga Limited\", \"company_type\": \"LLC\", \"registration_number\": \"123456789\", \"date_of_incorporation\": \"2009-02-22\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-30 20:15:05','2026-01-30 20:12:34','2026-01-30 20:15:05'),(31,20,2,'{}',1,'2026-01-30 20:15:15','2026-01-30 20:13:59','2026-01-30 20:15:14'),(32,20,3,'{}',0,NULL,'2026-01-30 20:14:04','2026-01-30 20:20:00'),(33,20,4,'{}',0,NULL,'2026-01-30 20:15:17','2026-01-30 20:19:58'),(34,20,5,'{}',0,NULL,'2026-01-30 20:18:00','2026-01-30 20:18:00'),(35,21,1,'{\"company_name\": \"test\", \"company_type\": \"LLC\", \"registration_number\": \"21432498354\", \"date_of_incorporation\": \"2009-02-02\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-30 20:24:00','2026-01-30 20:23:27','2026-01-30 20:23:59'),(36,21,2,'{\"contact_email\": \"nifcauser2026@example.com\", \"contact_phone\": \"254712345689\", \"physical_address\": \"Nairobi, Kenya\", \"contact_person_name\": \"Craft\"}',1,'2026-01-30 20:26:53','2026-01-30 20:24:42','2026-01-30 20:26:52'),(37,21,3,'{\"initial_capital\": 139999, \"proposed_activities\": [\"BANKING\", \"INSURANCE\"], \"business_plan_summary\": \"The company proposes to provide regulated financial services focused on digital banking and foreign exchange solutions. The core offering includes customer onboarding, account based transaction services, payments processing, and foreign currency exchange for individuals and small to medium enterprises. Services will be delivered through secure digital channels, supported by strong risk management, compliance, and customer due diligence frameworks aligned with regulatory requirements.\\n\\nThe business targets underserved and digitally active customers seeking efficient, transparent, and affordable financial services. Revenue will be generated through transaction fees, foreign exchange margins, and value added financial services. The company will prioritize financial inclusion, operational resilience, data security, and regulatory compliance while leveraging technology to improve service delivery and scalability.\", \"projected_annual_revenue\": 19996}',1,'2026-01-30 20:28:42','2026-01-30 20:27:00','2026-01-30 20:28:41'),(38,21,4,'{\"director_names\": \"Bazenga Dune Test\", \"beneficial_owners\": \"Bazenga Dune Test - 100%\", \"has_criminal_record\": \"no\", \"number_of_directors\": 1}',1,'2026-01-30 20:29:26','2026-01-30 20:28:46','2026-01-30 20:29:26'),(39,21,5,'{}',0,NULL,'2026-01-30 20:30:02','2026-01-30 20:30:02'),(40,22,1,'{\"company_name\": \"Best \"}',0,NULL,'2026-01-31 19:15:22','2026-01-31 19:15:22'),(41,23,1,'{\"company_name\": \"ABC Digital Finance Limited\", \"company_type\": \"BRANCH\", \"registration_number\": \"PVT-12345678\", \"date_of_incorporation\": \"2024-12-04\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-31 19:18:43','2026-01-31 19:17:18','2026-01-31 19:18:43'),(42,23,2,'{\"contact_email\": \"info@companyname.co.ke\", \"contact_phone\": \"254712345678\", \"postal_address\": \"P.O. Box 12345-00100, Nairobi\", \"physical_address\": \"Ngong Road, ABC Towers, 5th Floor, Nairobi, Kenya\", \"contact_person_name\": \"Savin Osuka\"}',1,'2026-01-31 19:25:47','2026-01-31 19:21:23','2026-01-31 19:25:47'),(43,23,3,'{\"initial_capital\": 100000, \"proposed_activities\": [\"FOREX\", \"BANKING\"], \"business_plan_summary\": \"The company proposes to offer digital financial services focused on banking and foreign exchange solutions for individuals and small to medium enterprises. Core services include account based transactions, payments facilitation, and foreign currency exchange delivered through secure digital platforms.\\n\\nThe target market includes SMEs, professionals, and digitally active customers seeking efficient, transparent, and affordable financial services. The business strategy emphasizes regulatory compliance, strong risk management, customer due diligence, and technology driven service delivery to ensure scalability, reliability, and financial inclusion.\", \"projected_annual_revenue\": 250000}',1,'2026-01-31 19:26:53','2026-01-31 19:26:16','2026-01-31 19:26:52'),(44,23,4,'{\"director_names\": \"Savin Osuka\\nJane Wanjiku Mwangi\", \"beneficial_owners\": \"Savin Osuka - 60%\\nJane Wanjiku Mwangi - 40%\", \"has_criminal_record\": \"no\", \"number_of_directors\": 2}',1,'2026-01-31 19:28:09','2026-01-31 19:27:22','2026-01-31 19:28:09'),(45,23,5,'{}',1,'2026-01-31 19:30:15','2026-01-31 19:30:15','2026-01-31 19:30:15'),(46,24,1,'{\"company_name\": \"Test\", \"company_type\": \"LLC\", \"registration_number\": \"9853534624\", \"date_of_incorporation\": \"2007-12-08\", \"country_of_incorporation\": \"US\"}',1,'2026-01-31 20:25:52','2026-01-31 20:11:49','2026-01-31 20:25:51'),(47,27,1,'{\"company_name\": \"Testng\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2009-09-09\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-31 21:17:53','2026-01-31 21:17:14','2026-01-31 21:17:53'),(48,27,2,'{\"contact_email\": \"ola@hot.le\", \"contact_phone\": \"254732456908\", \"postal_address\": \"dggrjrurye\\nfghetwetwytw\", \"physical_address\": \"wwrrtefgfhdghehjet\\nryeturyuetyert\", \"contact_person_name\": \"Monica Ochieng\"}',1,'2026-01-31 21:19:03','2026-01-31 21:18:02','2026-01-31 21:19:02'),(49,27,4,'{\"director_names\": \"Monica Awuor\", \"beneficial_owners\": \"Monica - 100%\", \"has_criminal_record\": \"yes\", \"number_of_directors\": 1}',1,'2026-01-31 21:19:59','2026-01-31 21:19:07','2026-01-31 21:19:58'),(50,27,5,'{}',1,'2026-01-31 21:21:12','2026-01-31 21:20:52','2026-01-31 21:21:11'),(51,30,1,'{\"company_name\": \"Ola Mi Amigo\", \"company_type\": \"PLC\", \"registration_number\": \"ABC-0987654\", \"date_of_incorporation\": \"2011-07-01\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-31 21:44:29','2026-01-31 21:43:50','2026-01-31 21:44:29'),(52,30,2,'{\"contact_email\": \"monty@nowhere.kim\", \"contact_phone\": \"254789321456\", \"physical_address\": \"P.O. Box 12345-00100, Nairobi\", \"contact_person_name\": \"Monty\"}',1,'2026-01-31 21:46:52','2026-01-31 21:44:37','2026-01-31 21:46:52'),(53,30,3,'{\"initial_capital\": 31750, \"proposed_activities\": [\"BANKING\"], \"business_plan_summary\": \"The company proposes to offer digital financial services focused on banking and foreign exchange solutions for individuals and small to medium enterprises. Core services include account based transactions, payments facilitation, and foreign currency exchange delivered through secure digital platforms.\\n\\nThe target market includes SMEs, professionals, and digitally active customers seeking efficient, transparent, and affordable financial services. The business strategy emphasizes regulatory compliance, strong risk management, customer due diligence, and technology driven service delivery to ensure scalability, reliability, and financial inclusion.\", \"projected_annual_revenue\": 24000}',1,'2026-01-31 21:47:28','2026-01-31 21:46:57','2026-01-31 21:47:28'),(54,30,4,'{\"director_names\": \"Savin Osuka\\nJane Wanjiku Mwangi\", \"beneficial_owners\": \"Savin Osuka - 60%\\nJane Wanjiku Mwangi - 40%\", \"has_criminal_record\": \"no\", \"number_of_directors\": 2}',1,'2026-01-31 21:48:09','2026-01-31 21:47:48','2026-01-31 21:48:09'),(55,30,5,'{}',1,'2026-01-31 21:52:08','2026-01-31 21:52:07','2026-01-31 21:52:07'),(56,38,1,'{\"company_name\": \"Test2\", \"company_type\": \"BRANCH\", \"registration_number\": \"123456\", \"date_of_incorporation\": \"2012-12-12\", \"country_of_incorporation\": \"KE\"}',1,'2026-02-01 13:08:02','2026-02-01 13:06:47','2026-02-01 13:08:02'),(57,35,1,'{\"company_name\": \"What The Hell\", \"company_type\": \"BRANCH\", \"registration_number\": \"XYZ-2345678\", \"date_of_incorporation\": \"2003-01-02\", \"country_of_incorporation\": \"US\"}',1,'2026-02-01 13:11:30','2026-02-01 13:08:37','2026-02-01 13:11:29'),(58,35,2,'{\"contact_email\": \"juli@test.com\", \"contact_phone\": \"+254746172500\", \"postal_address\": \"P.O. Box. 2345, Nairobi\", \"physical_address\": \"Canaan Estate, Nairobi\", \"contact_person_name\": \"Julie\"}',1,'2026-02-01 13:13:32','2026-02-01 13:11:34','2026-02-01 13:13:32'),(59,35,3,'{\"initial_capital\": 3420001, \"proposed_activities\": [\"FUND_MGMT\"], \"business_plan_summary\": \"Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.\", \"projected_annual_revenue\": 1200000}',1,'2026-02-01 13:14:13','2026-02-01 13:13:39','2026-02-01 13:14:12'),(60,35,4,'{\"director_names\": \"Julie\\nJames\", \"beneficial_owners\": \"Julie - 70%\\nJames - 30%\", \"has_criminal_record\": \"yes\", \"number_of_directors\": 2}',1,'2026-02-01 14:23:33','2026-02-01 13:14:22','2026-02-01 14:23:32'),(61,35,5,'{}',1,'2026-02-01 14:23:35','2026-02-01 13:15:44','2026-02-01 14:23:34');
/*!40000 ALTER TABLE `application_section_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_sections`
--

DROP TABLE IF EXISTS `application_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_type_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `display_order` int NOT NULL,
  `is_required` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_section_order` (`application_type_id`,`display_order`),
  KEY `idx_sections_type` (`application_type_id`),
  CONSTRAINT `application_sections_ibfk_1` FOREIGN KEY (`application_type_id`) REFERENCES `application_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_sections`
--

LOCK TABLES `application_sections` WRITE;
/*!40000 ALTER TABLE `application_sections` DISABLE KEYS */;
INSERT INTO `application_sections` VALUES (1,1,'Company Information','Basic information about your company',1,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(2,1,'Contact Details','Primary contact person and company address',2,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(3,1,'Business Activities','Details about proposed financial services activities',3,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(4,1,'Directors & Shareholders','Information about key personnel',4,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(5,1,'Supporting Documents','Required documentation upload',5,1,'2026-01-28 20:19:45','2026-01-28 20:19:45');
/*!40000 ALTER TABLE `application_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application_types`
--

DROP TABLE IF EXISTS `application_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_application_types_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_types`
--

LOCK TABLES `application_types` WRITE;
/*!40000 ALTER TABLE `application_types` DISABLE KEYS */;
INSERT INTO `application_types` VALUES (1,'Financial Services License','FSL','Application for obtaining a financial services license in the Nairobi International Finance Center',1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(2,'Company Registration','CR','Application for registering a new company in NIFCA',1,'2026-01-28 20:19:45','2026-01-28 20:19:45');
/*!40000 ALTER TABLE `application_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `application_type_id` int DEFAULT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('draft','pending','submitted','under_review','approved','rejected','cancelled') DEFAULT 'draft',
  `submitted_at` datetime DEFAULT NULL,
  `reviewed_by` int DEFAULT NULL,
  `review_comments` text,
  `pdf_path` varchar(500) DEFAULT NULL,
  `pdf_generated_at` datetime DEFAULT NULL,
  `current_section` int DEFAULT '1',
  `completion_percentage` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cancelled_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_reference` (`reference_number`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `idx_applications_client_status` (`client_id`,`status`),
  KEY `idx_applications_status` (`status`),
  KEY `fk_application_type` (`application_type_id`),
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `applications_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `fk_application_type` FOREIGN KEY (`application_type_id`) REFERENCES `application_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (3,9,NULL,'APP-2025-00003','Funding Request','Requesting funding for a community project.','pending',NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-19 17:23:32','2026-01-31 22:13:43',NULL),(4,9,NULL,'APP-2025-00004','Funding Request','Requesting funding for a community project.','pending',NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-19 17:24:39','2026-01-31 22:13:43',NULL),(5,9,NULL,'APP-2025-00005','Funding Request','Requesting funding for a community project.','pending',NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-19 17:29:37','2026-01-31 22:13:43',NULL),(8,11,1,'NIFCA-2026-00008','Test FSL Application','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-29 20:01:26','2026-01-29 20:01:26',NULL),(9,7,2,'NIFCA-2026-00009','Test Application 1769707067629','Application for registering a new company in NIFCA','rejected','2026-01-29 20:17:47',55,'rejected','assets/pdfs/application_NIFCA-2026-00009_1769707067695.pdf','2026-01-29 20:17:47',1,100,'2026-01-29 20:17:47','2026-01-31 20:02:08',NULL),(10,7,2,'NIFCA-2026-00010','Admin Test Application 1769707068035','Application for registering a new company in NIFCA','approved','2026-01-29 20:17:48',42,'Application is under review. Additional documents may be requested.','assets/pdfs/application_NIFCA-2026-00010_1769707068065.pdf','2026-01-29 20:17:48',1,100,'2026-01-29 20:17:48','2026-01-29 20:17:48',NULL),(11,7,1,'NIFCA-2026-00011','Test Application 1769707107846','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:18:27','2026-01-29 20:18:27',NULL),(12,7,1,'NIFCA-2026-00012','Admin Test Application 1769707108202','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:18:28','2026-01-29 20:18:28',NULL),(13,7,1,'NIFCA-2026-00013','Test Application 1769707165404','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:19:25','2026-01-29 20:19:25',NULL),(14,7,1,'NIFCA-2026-00014','Admin Test Application 1769707165728','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:19:25','2026-01-29 20:19:25',NULL),(15,7,1,'NIFCA-2026-00015','Test Application 1769707204684','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,4,80,'2026-01-29 20:20:04','2026-01-29 20:20:04',NULL),(16,7,1,'NIFCA-2026-00016','Admin Test Application 1769707205200','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,NULL,NULL,NULL,NULL,4,80,'2026-01-29 20:20:05','2026-01-29 20:20:05',NULL),(17,13,2,'NIFCA-2026-00017','Company Registration','Application for registering a new company in NIFCA','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-30 19:52:32','2026-01-30 19:52:32',NULL),(18,13,1,'NIFCA-2026-00018','Test FSL Application','Application for obtaining a financial services license in the Nairobi International Finance Center','approved','2026-01-30 20:06:33',55,'okay','assets/pdfs/application_NIFCA-2026-00018_1769792792979.pdf','2026-01-30 20:06:33',5,100,'2026-01-30 19:55:54','2026-01-31 22:53:29',NULL),(19,13,1,'NIFCA-2026-00019','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-30 20:11:55','2026-01-30 20:11:55',NULL),(20,13,1,'NIFCA-2026-00020','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,5,40,'2026-01-30 20:12:22','2026-01-30 20:20:00',NULL),(21,13,1,'NIFCA-2026-00021','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,5,80,'2026-01-30 20:23:19','2026-01-30 20:30:02',NULL),(22,13,1,'NIFCA-2026-00022','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 19:15:11','2026-01-31 19:15:11',NULL),(23,13,1,'NIFCA-2026-00023','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','approved','2026-01-31 19:30:17',55,'Approved','assets/pdfs/application_NIFCA-2026-00023_1769877017430.pdf','2026-01-31 19:30:17',5,100,'2026-01-31 19:16:09','2026-01-31 19:40:23',NULL),(24,13,1,'NIFCA-2026-00024','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,20,'2026-01-31 20:11:45','2026-01-31 20:25:51',NULL),(25,13,1,'NIFCA-2026-00025','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 20:26:10','2026-01-31 20:26:10',NULL),(26,13,1,'NIFCA-2026-00026','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 20:57:04','2026-01-31 20:57:04',NULL),(27,13,1,'NIFCA-2026-00027','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,5,80,'2026-01-31 21:17:04','2026-01-31 21:21:11',NULL),(28,13,2,'NIFCA-2026-00028','Company Registration','Application for registering a new company in NIFCA','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 21:41:53','2026-01-31 21:41:53',NULL),(29,13,1,'NIFCA-2026-00029','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 21:42:56','2026-01-31 21:42:56',NULL),(30,13,1,'NIFCA-2026-00030','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','rejected','2026-01-31 21:52:09',55,'no','assets/pdfs/application_NIFCA-2026-00030_1769885529464.pdf','2026-01-31 21:52:09',5,100,'2026-01-31 21:43:41','2026-01-31 22:22:34',NULL),(31,13,1,'NIFCA-2026-00031','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 22:43:57','2026-01-31 22:43:57',NULL),(32,13,1,'NIFCA-2026-00032','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 22:45:40','2026-01-31 22:45:40',NULL),(33,13,1,'NIFCA-2026-00033','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 22:46:28','2026-01-31 22:46:28',NULL),(34,13,1,'NIFCA-2026-00034','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-01 09:45:21','2026-02-01 09:45:21',NULL),(35,13,1,'NIFCA-2026-00035','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','approved','2026-02-01 14:23:36',55,'All good. Welcome to Kenya','assets/pdfs/application_NIFCA-2026-00035_1769945016349.pdf','2026-02-01 14:23:36',5,100,'2026-02-01 09:47:52','2026-02-01 14:25:27',NULL),(36,13,1,'NIFCA-2026-00036','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-01 12:20:59','2026-02-01 12:20:59',NULL),(37,13,1,'NIFCA-2026-00037','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-01 12:48:14','2026-02-01 12:48:14',NULL),(38,13,1,'NIFCA-2026-00038','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,1,20,'2026-02-01 12:51:17','2026-02-01 13:08:02',NULL);
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `company_id` int NOT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'inactive',
  `enabled` tinyint(1) DEFAULT '0',
  `failed_attempts` int DEFAULT '0',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `fk_clients_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (7,'testclient4','client@nifca.com','$2a$10$y5RLwnGpgPB0/ps6KubtJec58zbLaSTLCJzi7xkOtXqVvko.l4yty',1,NULL,'2026-01-29 17:17:41','active',1,0,'2026-01-30 15:56:34','2025-03-27 13:52:35','2026-01-30 15:56:34',NULL,NULL),(8,'client1','client2@nifca.com','$2a$10$2uvUZ3f64UimwZN69Wnv4u4yn9TaatjlGSZvv16GcyLMoedN4d1NK',1,NULL,'2025-03-29 10:55:49','active',1,0,'2025-03-29 10:57:52','2025-03-29 10:55:30','2025-04-19 10:52:29',NULL,NULL),(9,'testclient','allenpane39@gmail.com','$2a$10$O7869hPHMlMTrPiA44V5oOsy9ocaIGlYgbDPRlUUoYa1y4.Ct3AaK',1,NULL,'2025-04-19 10:54:56','active',1,0,'2025-04-19 14:24:34','2025-04-19 10:54:09','2026-01-30 17:25:35',NULL,NULL),(10,'testclient2','testclient2@nifca.com','$2a$10$Zmvv59iAO1oj/XUwgysDEOgio.6Qwy0SNwOpJ7N0Fh5nY8cIVn7WG',1,NULL,'2026-01-28 17:45:34','active',1,0,'2026-01-28 17:47:01','2026-01-28 17:45:34','2026-01-28 17:47:01',NULL,NULL),(11,'testclient1','testclient1@example.com','$2a$10$yTnPvqK7q0dnXpOXlvxcC.v7caQIguxzwvhWp1LCyenbrFyLLJmXK',1,NULL,'2026-01-29 16:59:28','active',1,0,'2026-01-29 17:01:13','2026-01-29 16:57:29','2026-01-29 17:01:13',NULL,NULL),(12,'testuser123','testuser123@example.com','$2a$10$4mc5bZZBlOeZaWRiTLno9.R..WeYxmOG7Uw3XTEkGl/Lvf1wmLkIC',1,'45f5e7d881d3d72d505723313a96237ebdec835abe98369142244405706a0dcf',NULL,'inactive',0,0,NULL,'2026-01-30 16:47:53','2026-01-30 16:47:53',NULL,NULL),(13,'nifcauser2026','nifcauser2026@example.com','$2a$10$CLYNDq3gA2h.DhbxSPpufO8GxLNtY/tv9Kqmoq4SYfBDfUyKxAUqu',1,NULL,'2026-01-30 16:50:16','active',1,0,'2026-02-01 10:05:13','2026-01-30 16:49:17','2026-02-01 10:05:13',NULL,NULL);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email_domain` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email_domain` (`email_domain`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'Nifca',NULL,'2025-02-10 18:40:14');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `picture` varchar(255) DEFAULT NULL,
  `event_start_date` datetime DEFAULT NULL,
  `event_end_date` datetime DEFAULT NULL,
  `post_to_twitter` tinyint(1) DEFAULT '0' COMMENT 'Enable automatic posting to Twitter/X',
  `post_to_linkedin` tinyint(1) DEFAULT '0' COMMENT 'Enable automatic posting to LinkedIn',
  `twitter_post_id` varchar(255) DEFAULT NULL,
  `linkedin_post_id` varchar(255) DEFAULT NULL,
  `twitter_post_url` text,
  `linkedin_post_url` text,
  `social_media_posted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'Annual Gala','Join us for our annual gala event.','NIFCA Headquarters',38,'2025-03-29 11:03:08','2025-10-13 01:10:43','/assets/events/nifca_event_ufpid_1760307043532.png','2025-10-13 01:09:00','2025-11-11 01:10:00',0,0,NULL,NULL,NULL,NULL,NULL),(4,'Board Meeting','Test','Nairobi, Kenya',55,'2025-10-13 01:07:44','2025-10-13 01:07:44','/assets/events/nifca_event_414sn_1760306864704.png','2025-10-14 01:07:00','2025-10-15 01:07:00',0,0,NULL,NULL,NULL,NULL,NULL),(5,'Presentation','Today\'s presentation','UpperHill',55,'2025-10-13 11:36:07','2025-10-13 11:37:07','/assets/news/nifca_news_gwhyp_5.png','2025-10-16 11:36:00','2025-10-22 11:36:00',0,0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_media`
--

DROP TABLE IF EXISTS `gallery_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery_media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('picture','video') NOT NULL,
  `url` varchar(255) NOT NULL,
  `caption` text,
  `created_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `gallery_media_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_media`
--

LOCK TABLES `gallery_media` WRITE;
/*!40000 ALTER TABLE `gallery_media` DISABLE KEYS */;
INSERT INTO `gallery_media` VALUES (4,'picture','/assets/gallery/nifca_gallery_xn4o2_1760346301195.png','hello world',55,'2025-10-13 12:05:01','2025-10-13 12:05:01'),(5,'picture','/assets/gallery/nifca_gallery_34oog_1760347133725.png','logo',55,'2025-10-13 12:18:53','2025-10-13 12:18:53');
/*!40000 ALTER TABLE `gallery_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `picture` varchar(255) DEFAULT NULL,
  `post_to_twitter` tinyint(1) DEFAULT '0' COMMENT 'Enable automatic posting to Twitter/X',
  `post_to_linkedin` tinyint(1) DEFAULT '0' COMMENT 'Enable automatic posting to LinkedIn',
  `twitter_post_id` varchar(255) DEFAULT NULL,
  `linkedin_post_id` varchar(255) DEFAULT NULL,
  `twitter_post_url` text,
  `linkedin_post_url` text,
  `social_media_posted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `news_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (5,'New Test Article','This is the content of the new test article.',55,'2025-09-29 22:20:51','2025-09-29 22:20:51',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(8,'New Test Article 2','This is the content of the new test article.',55,'2025-09-29 22:29:26','2025-09-29 22:29:26','/assets/1759174165421pexels-photo-31325371.jpeg',0,0,NULL,NULL,NULL,NULL,NULL),(9,'Updated Test Article 3','This is the updated content of the new test article.',55,'2025-09-29 22:31:21','2025-09-29 22:41:27','/assets/1759174887759pexels-photo-16803438.jpeg',0,0,NULL,NULL,NULL,NULL,NULL),(10,'Updated Article Title 4','This is the updated content of the article.',55,'2025-09-29 22:48:58','2025-10-13 00:41:48','/assets/news/nifca_news_z64ya_1760305308347.png',0,0,NULL,NULL,NULL,NULL,NULL),(12,'test','frontend',55,'2025-10-13 00:15:38','2025-10-13 00:15:38','/assets/news/nifca_news_9elyj_12.jpeg',0,0,NULL,NULL,NULL,NULL,NULL),(13,'frontend','test',55,'2025-10-13 00:29:52','2025-10-13 00:29:52','/assets/news/nifca_news_tr63o_1760304592781.png',0,0,NULL,NULL,NULL,NULL,NULL),(16,'test','test world',55,'2025-10-13 11:40:35','2025-10-13 11:40:35',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(17,'blah ','blah',55,'2025-10-13 11:40:47','2025-10-13 11:40:47',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(18,'nah ah ','hellnah',55,'2025-10-13 11:41:03','2025-10-13 11:41:03',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(19,'ola test','ola',55,'2025-10-13 21:18:45','2025-10-13 21:18:45','/assets/news/nifca_news_b25m5_1760379525133.png',0,0,NULL,NULL,NULL,NULL,NULL),(20,'ola babe','what?',55,'2025-10-13 21:38:05','2025-10-13 21:38:05','/assets/news/nifca_news_4ibah_1760380685088.png',0,0,NULL,NULL,NULL,NULL,NULL),(21,'social_media test','hello post from web',55,'2025-10-13 21:40:44','2025-10-13 21:40:44','/assets/news/nifca_news_12szm_1760380844802.png',0,0,NULL,NULL,NULL,NULL,NULL),(22,'test','hello social media',55,'2025-10-13 21:45:37','2025-10-13 21:45:37','/assets/news/nifca_news_qcoug_1760381137385.png',0,0,NULL,NULL,NULL,NULL,NULL),(23,'NIFCA Launches Financial Innovation Hub','The Nairobi International Finance Centre is proud to announce the launch of a new Financial Innovation Hub aimed at fostering collaboration between fintech startups and traditional institutions.',55,'2025-10-13 21:55:00','2025-10-13 21:55:00','/assets/news/nifca_news_bb7kc_1760381700391.png',0,0,NULL,NULL,NULL,NULL,NULL),(24,'Test 29','Test-29-10-2025',55,'2025-10-29 21:05:54','2025-10-29 21:05:54','/assets/news/nifca_news_s8z5y_1761761154726.png',0,0,NULL,NULL,NULL,NULL,NULL),(25,'Test News: NIFCA Social Media Integration','This is a test article to verify that social media posting works correctly with our Twitter and LinkedIn integration. The NIFCA platform is testing its automated posting capabilities to ensure seamless content distribution across multiple platforms.',55,'2025-10-29 21:12:05','2025-10-29 21:12:06','/assets/news/nifca_news_v8n1e_25',0,0,NULL,NULL,NULL,NULL,NULL),(26,'NIFCA Social Media Test #2','This is our second test of the social media integration. We are verifying that the Twitter posting works correctly after updating app permissions to Read and Write. The system should now be able to post tweets automatically when news articles are created.',55,'2025-10-29 21:33:11','2025-10-29 21:33:12','/assets/news/nifca_news_ry5rj_26',0,0,NULL,NULL,NULL,NULL,NULL),(27,'NIFCA Twitter Integration Test #3','This is our third test with regenerated access tokens. After updating app permissions to Read and Write and regenerating the access tokens, the Twitter integration should now work correctly. The NIFCA platform can automatically post news updates to Twitter!',55,'2025-10-29 21:38:17','2025-10-29 21:38:18','/assets/news/nifca_news_j6dne_27',0,0,NULL,NULL,NULL,NULL,NULL),(28,'Test From Frontend','Test From Frontend',55,'2025-10-29 21:43:10','2025-10-29 21:43:10','/assets/news/nifca_news_d84fs_1761763390772.png',0,0,NULL,NULL,NULL,NULL,NULL),(29,'Test','Test at 28-11-2025',55,'2025-11-28 09:57:25','2025-11-28 09:57:25','/assets/news/nifca_news_wcv8g_1764313045881.png',0,0,NULL,NULL,NULL,NULL,NULL),(30,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa’s economic future.',55,'2025-11-28 10:05:49','2025-11-28 10:05:49','/assets/news/nifca_news_vo104_1764313549778.png',0,0,NULL,NULL,NULL,NULL,NULL),(31,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa',55,'2025-11-28 10:27:45','2025-11-28 10:27:45','/assets/news/nifca_news_vmpin_1764314865796.png',0,0,NULL,NULL,NULL,NULL,NULL),(32,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:29:22','2025-11-28 10:29:22','/assets/news/nifca_news_ue64b_1764314962370.png',0,0,NULL,NULL,NULL,NULL,NULL),(33,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa',55,'2025-11-28 10:31:22','2025-11-28 10:31:22','/assets/news/nifca_news_p26gw_1764315082865.png',0,0,NULL,NULL,NULL,NULL,NULL),(34,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:32:30','2025-11-28 10:32:30','/assets/news/nifca_news_mkq5n_1764315150431.png',0,0,NULL,NULL,NULL,NULL,NULL),(35,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:33:25','2025-11-28 10:33:25',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(36,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:41:36','2025-11-28 10:41:36','/assets/news/nifca_news_i210y_1764315696477.png',0,0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `press_releases`
--

DROP TABLE IF EXISTS `press_releases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `press_releases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `post_to_twitter` tinyint(1) DEFAULT '0' COMMENT 'Enable automatic posting to Twitter/X',
  `post_to_linkedin` tinyint(1) DEFAULT '0' COMMENT 'Enable automatic posting to LinkedIn',
  `twitter_post_id` varchar(255) DEFAULT NULL,
  `linkedin_post_id` varchar(255) DEFAULT NULL,
  `twitter_post_url` text,
  `linkedin_post_url` text,
  `social_media_posted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `press_releases_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `press_releases`
--

LOCK TABLES `press_releases` WRITE;
/*!40000 ALTER TABLE `press_releases` DISABLE KEYS */;
INSERT INTO `press_releases` VALUES (2,'Hello World ','Hello World ',55,'2025-10-13 11:47:38','2025-10-13 11:47:38',0,0,NULL,NULL,NULL,NULL,NULL),(3,'Hello World ','Hello World ',55,'2025-10-13 11:47:47','2025-10-13 11:47:47',0,0,NULL,NULL,NULL,NULL,NULL),(4,'Hello World ','Hello World ',55,'2025-10-13 11:47:56','2025-10-13 11:47:56',0,0,NULL,NULL,NULL,NULL,NULL),(5,'Hello World ','Hello World ',55,'2025-10-13 11:48:04','2025-10-13 11:48:04',0,0,NULL,NULL,NULL,NULL,NULL),(6,'Hello World ','Hello World ',55,'2025-10-13 11:48:12','2025-10-13 11:48:12',0,0,NULL,NULL,NULL,NULL,NULL),(7,'Hello World ','Hello World ',55,'2025-10-13 11:48:21','2025-10-13 11:48:21',0,0,NULL,NULL,NULL,NULL,NULL),(8,'Hello World ','Hello World ',55,'2025-10-13 11:48:30','2025-10-13 11:48:30',0,0,NULL,NULL,NULL,NULL,NULL),(9,'Hello World ','Hello World ',55,'2025-10-13 11:48:39','2025-10-13 11:48:39',0,0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `press_releases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'site_admin','2025-02-10 18:37:34'),(2,'content_admin','2025-02-10 18:37:34'),(3,'application_admin','2025-02-10 18:37:34'),(4,'press release','2025-02-10 18:37:34'),(5,'media','2025-02-10 18:37:34'),(6,'events','2025-02-10 18:37:34'),(7,'client','2025-02-10 18:37:34');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section_fields`
--

DROP TABLE IF EXISTS `section_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section_fields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `field_label` varchar(255) NOT NULL,
  `field_type` enum('text','textarea','number','email','date','select','checkbox','radio','file') NOT NULL,
  `field_options` json DEFAULT NULL COMMENT 'Options for select, checkbox, radio fields: [{"value": "x", "label": "X"}]',
  `validation_rules` json DEFAULT NULL COMMENT 'Validation rules: {"minLength": 3, "maxLength": 100, "pattern": "regex", "min": 0, "max": 100}',
  `is_required` tinyint(1) DEFAULT '0',
  `display_order` int NOT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `help_text` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_field_name` (`section_id`,`field_name`),
  KEY `idx_fields_section` (`section_id`),
  CONSTRAINT `section_fields_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `application_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_fields`
--

LOCK TABLES `section_fields` WRITE;
/*!40000 ALTER TABLE `section_fields` DISABLE KEYS */;
INSERT INTO `section_fields` VALUES (1,1,'company_name','Company Name','text',NULL,'{\"maxLength\": 200, \"minLength\": 3}',1,1,'Enter your company name','Legal name as registered','2026-01-28 20:19:45','2026-01-28 20:19:45'),(2,1,'registration_number','Company Registration Number','text',NULL,'{\"pattern\": \"^[A-Z0-9-]+$\"}',1,2,'e.g., ABC-123456','Your company registration number from the registrar','2026-01-28 20:19:45','2026-01-28 20:19:45'),(3,1,'date_of_incorporation','Date of Incorporation','date',NULL,NULL,1,3,NULL,'When was the company incorporated?','2026-01-28 20:19:45','2026-01-28 20:19:45'),(4,1,'country_of_incorporation','Country of Incorporation','select','[{\"label\": \"Kenya\", \"value\": \"KE\"}, {\"label\": \"United States\", \"value\": \"US\"}, {\"label\": \"United Kingdom\", \"value\": \"UK\"}, {\"label\": \"Other\", \"value\": \"OTHER\"}]',NULL,1,4,NULL,'Select the country where your company is incorporated','2026-01-28 20:19:45','2026-01-28 20:19:45'),(5,1,'company_type','Type of Company','select','[{\"label\": \"Limited Liability Company\", \"value\": \"LLC\"}, {\"label\": \"Public Limited Company\", \"value\": \"PLC\"}, {\"label\": \"Branch of Foreign Company\", \"value\": \"BRANCH\"}]',NULL,1,5,NULL,NULL,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(11,5,'certificate_of_incorporation','Certificate of Incorporation','file',NULL,'{\"accept\": \".pdf,.jpg,.png\", \"maxSize\": 10485760}',1,1,NULL,'Upload a certified copy (PDF, JPG, or PNG, max 10MB)','2026-01-28 20:29:18','2026-01-28 20:29:18'),(12,5,'memorandum_articles','Memorandum & Articles of Association','file',NULL,'{\"accept\": \".pdf\", \"maxSize\": 10485760}',1,2,NULL,'Upload PDF document','2026-01-28 20:29:18','2026-01-28 20:29:18'),(13,5,'business_plan','Detailed Business Plan','file',NULL,'{\"accept\": \".pdf,.doc,.docx\", \"maxSize\": 10485760}',1,3,NULL,'Upload detailed business plan document','2026-01-28 20:29:18','2026-01-28 20:29:18'),(14,5,'financial_projections','Financial Projections','file',NULL,'{\"accept\": \".pdf,.xls,.xlsx\", \"maxSize\": 10485760}',1,4,NULL,'5-year financial projections','2026-01-28 20:29:18','2026-01-28 20:29:18'),(15,5,'additional_documents','Additional Supporting Documents','file',NULL,'{\"accept\": \".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png\", \"maxSize\": 10485760}',0,5,NULL,'Any other relevant documents (optional)','2026-01-28 20:29:18','2026-01-28 20:29:18'),(16,2,'contact_person_name','Contact Person Name','text',NULL,'{\"maxLength\": 100, \"minLength\": 2}',1,1,'Full name of primary contact',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(17,2,'contact_email','Contact Email','email',NULL,NULL,1,2,'email@company.com',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(18,2,'contact_phone','Contact Phone','text',NULL,'{\"pattern\": \"^[+]?[0-9s-]+$\"}',1,3,'+254 XXX XXX XXX',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(19,2,'physical_address','Physical Address','textarea',NULL,'{\"maxLength\": 500, \"minLength\": 10}',1,4,'Street address, Building, Floor',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(20,2,'postal_address','Postal Address','textarea',NULL,'{\"maxLength\": 300}',0,5,'P.O. Box XXXXX, Nairobi','Optional','2026-01-30 20:18:50','2026-01-30 20:18:50'),(21,3,'proposed_activities','Proposed Financial Activities','checkbox','[{\"label\": \"Banking Services\", \"value\": \"BANKING\"}, {\"label\": \"Insurance Services\", \"value\": \"INSURANCE\"}, {\"label\": \"Securities Trading\", \"value\": \"SECURITIES\"}, {\"label\": \"Fund Management\", \"value\": \"FUND_MGMT\"}, {\"label\": \"Foreign Exchange Services\", \"value\": \"FOREX\"}]',NULL,1,1,NULL,'Select all that apply','2026-01-30 20:18:50','2026-01-30 20:18:50'),(22,3,'business_plan_summary','Business Plan Summary','textarea',NULL,'{\"maxLength\": 2000, \"minLength\": 100}',1,2,'Provide a summary of your business plan...','Describe your proposed business activities, target market, and strategy','2026-01-30 20:18:50','2026-01-30 20:18:50'),(23,3,'projected_annual_revenue','Projected Annual Revenue (USD)','number',NULL,'{\"min\": 0}',1,3,'0','Estimated first year revenue','2026-01-30 20:18:50','2026-01-30 20:18:50'),(24,3,'initial_capital','Initial Capital Investment (USD)','number',NULL,'{\"min\": 0}',1,4,'0','Amount of capital to be invested','2026-01-30 20:18:50','2026-01-30 20:18:50'),(25,4,'number_of_directors','Number of Directors','number',NULL,'{\"max\": 50, \"min\": 1}',1,1,'0',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(26,4,'director_names','Names of Directors','textarea',NULL,'{\"minLength\": 3}',1,2,'List each director on a new line','Full legal names of all directors','2026-01-30 20:18:50','2026-01-30 20:18:50'),(27,4,'beneficial_owners','Beneficial Owners (>10% ownership)','textarea',NULL,NULL,1,3,'Name - Percentage ownership','List all persons or entities with more than 10% ownership','2026-01-30 20:18:50','2026-01-30 20:18:50'),(28,4,'has_criminal_record','Do any directors have criminal records?','radio','[{\"label\": \"Yes\", \"value\": \"yes\"}, {\"label\": \"No\", \"value\": \"no\"}]',NULL,1,4,NULL,'This will be verified','2026-01-30 20:18:50','2026-01-30 20:18:50');
/*!40000 ALTER TABLE `section_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` text,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_media_posts`
--

DROP TABLE IF EXISTS `social_media_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `social_media_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content_type` enum('news','press_release','event') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_id` int NOT NULL,
  `platform` enum('twitter','linkedin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `post_url` text COLLATE utf8mb4_unicode_ci,
  `success` tinyint(1) DEFAULT '1',
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `posted_by` int NOT NULL,
  `posted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `posted_by` (`posted_by`),
  KEY `idx_content` (`content_type`,`content_id`),
  KEY `idx_platform` (`platform`),
  KEY `idx_posted_at` (`posted_at`),
  CONSTRAINT `social_media_posts_ibfk_1` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_media_posts`
--

LOCK TABLES `social_media_posts` WRITE;
/*!40000 ALTER TABLE `social_media_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_media_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_audit_log`
--

DROP TABLE IF EXISTS `user_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_audit_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `performed_by` int NOT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `performed_by` (`performed_by`),
  CONSTRAINT `user_audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_audit_log_ibfk_2` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_audit_log`
--

LOCK TABLES `user_audit_log` WRITE;
/*!40000 ALTER TABLE `user_audit_log` DISABLE KEYS */;
INSERT INTO `user_audit_log` VALUES (1,39,'create',33,NULL,'{\"email\": \"contentadmin2@nifca.com\", \"role_id\": 2, \"username\": \"contentadmin2\", \"company_id\": 1}','2025-03-29 12:57:25'),(2,39,'disable',33,'{\"enabled\": 1}','{\"enabled\": false}','2025-03-29 13:02:45'),(3,39,'enable',33,'{\"enabled\": 0}','{\"enabled\": true}','2025-03-29 13:05:38'),(4,39,'reset_password',33,NULL,NULL,'2025-03-29 13:08:10'),(5,40,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 3, \"username\": \"appadmin\", \"company_id\": 1}','2025-03-29 13:49:33'),(6,40,'verify_email',40,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-03-29 13:50:09'),(7,40,'reset_password',40,NULL,NULL,'2025-03-29 14:01:26'),(8,42,'create',33,NULL,'{\"email\": \"appadmin@nifca.com\", \"role_id\": 3, \"username\": \"appadmin\", \"company_id\": 1}','2025-04-19 13:40:12'),(9,43,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane\", \"company_id\": 1}','2025-04-22 21:24:55'),(10,43,'verify_email',43,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 21:33:34'),(11,45,'create',33,NULL,'{\"email\": \"allenpane@gmail.com\", \"role_id\": 2, \"username\": \"allenpane@gmail.com\", \"company_id\": 1}','2025-04-22 21:38:46'),(12,47,'create',33,NULL,'{\"email\": \"allenpane@gmail.com\", \"role_id\": 2, \"username\": \"allenpane@gmail.com\", \"company_id\": 1}','2025-04-22 21:52:09'),(13,48,'create',33,NULL,'{\"email\": \"allenpane@gmail.com\", \"role_id\": 2, \"username\": \"allenpane@gmail.com\", \"company_id\": 1}','2025-04-22 21:54:41'),(14,49,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane399@gmail.com\", \"company_id\": 1}','2025-04-22 21:58:57'),(15,50,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane399@gmail.com\", \"company_id\": 1}','2025-04-22 22:10:15'),(16,51,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane399@gmail.com\", \"company_id\": 1}','2025-04-22 22:31:50'),(17,51,'verify_email',51,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 22:35:29'),(18,52,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 2, \"username\": \"osuka-admin\", \"company_id\": 1}','2025-04-22 22:40:39'),(19,52,'verify_email',52,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 22:44:46'),(20,53,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 3, \"username\": \"osuka-admin\", \"company_id\": 1}','2025-04-22 22:54:07'),(21,54,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 2, \"username\": \"osuka-admin\", \"company_id\": 1}','2025-04-22 23:04:35'),(22,55,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 2, \"username\": \"osuka\", \"company_id\": 1}','2025-04-22 23:06:29'),(23,55,'verify_email',55,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 23:06:49'),(24,55,'reset_password',55,NULL,NULL,'2025-04-22 23:48:13'),(25,51,'reset_password',51,NULL,NULL,'2025-04-22 23:50:41'),(26,55,'reset_password',55,NULL,NULL,'2025-04-22 23:55:37'),(27,55,'reset_password',55,NULL,NULL,'2025-04-22 23:58:53'),(28,55,'reset_password',55,NULL,NULL,'2025-04-23 00:05:18'),(29,55,'reset_password',55,NULL,NULL,'2025-04-23 00:16:48'),(30,56,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"contentuser\", \"company_id\": 1}','2025-09-14 14:29:23'),(31,58,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 3, \"username\": \"apptest\", \"company_id\": 1}','2026-01-28 19:39:36');
/*!40000 ALTER TABLE `user_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tokens`
--

DROP TABLE IF EXISTS `user_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(512) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_user_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tokens`
--

LOCK TABLES `user_tokens` WRITE;
/*!40000 ALTER TABLE `user_tokens` DISABLE KEYS */;
INSERT INTO `user_tokens` VALUES (19,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzIzOTA2MiwiZXhwIjoxNzQzMjQyNjYyfQ.k0NGM7o-7tE07wmxWjeqLOD_YJ7dH5NtyIbnhWwBF8k','2025-03-29 09:04:22','2025-03-29 10:04:22'),(20,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0MDY4MCwiZXhwIjoxNzQzMjQ0MjgwfQ.YlmpAjj2CEVeOCy6uEcmNsW03q4rtxyYsm_L1VX86Gk','2025-03-29 09:31:20','2025-03-29 10:31:20'),(21,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0MTc4NCwiZXhwIjoxNzQzMjQ1Mzg0fQ.4X5dNy3krJXC0Qdp0KWWUvytOE838CHKYGN4ntq8ySU','2025-03-29 09:49:44','2025-03-29 10:49:44'),(22,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0MjAxMiwiZXhwIjoxNzQzMjQ1NjEyfQ.6GOvCINZa3Z_Ca6TMW-8zBBlWbuCWS2dzCauNGm7Xds','2025-03-29 09:53:32','2025-03-29 10:53:33'),(25,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0NTExOCwiZXhwIjoxNzQzMjQ4NzE4fQ.1ESWO3yj2eoyxRsm2YQ0i_g4sHCR7FTjSiStgEprPdQ','2025-03-29 10:45:18','2025-03-29 11:45:19'),(27,40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0NjEwMiwiZXhwIjoxNzQzMjQ5NzAyfQ.q_ngKV-FC05iRrp1REycRTErv2aF8G0-RIMkO9XtpEk','2025-03-29 11:01:42','2025-03-29 12:01:42'),(28,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NTIxOSwiZXhwIjoxNzQ1MDU4ODE5fQ.qdu_LdT65tw9zHRX1Qf2vr_RJtHlpKa4_OvByekIQ90','2025-04-19 09:33:39','2025-04-19 10:33:39'),(29,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NTU4MCwiZXhwIjoxNzQ1MDU5MTgwfQ.KVU3aVZ3nAJtwpnsrsjG--enjfYYNjYbiNDUz6fCwAc','2025-04-19 09:39:40','2025-04-19 10:39:41'),(30,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NTYzMCwiZXhwIjoxNzQ1MDU5MjMwfQ.i5zLU3GyFiJbxRus8p-MS9JuFPiqAfxeafgU5nqXeh8','2025-04-19 09:40:30','2025-04-19 10:40:31'),(31,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NzY0NSwiZXhwIjoxNzQ1MDYxMjQ1fQ.43teCfrOABZCpCr6wIr2C1ksZC0_9hTtiKmQmKWpMCA','2025-04-19 10:14:05','2025-04-19 11:14:05'),(32,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1ODU4NiwiZXhwIjoxNzQ1MDYyMTg2fQ.egEqd4FXGPYrEl-MQPzEzC4cruhThr_kgwfcyevbUwE','2025-04-19 10:29:46','2025-04-19 11:29:47'),(33,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1OTQzNywiZXhwIjoxNzQ1MDYzMDM3fQ.p9cZBOd18YL-_Xmu9MtI1h5goNrMuo4ZTX45uR9rb6c','2025-04-19 10:43:57','2025-04-19 11:43:57'),(34,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MTExMSwiZXhwIjoxNzQ1MzQ0NzExfQ.RJfCo2aKmoBetqacGoXsCLNGltAuFP8Ufp2dOTt8-yE','2025-04-22 16:58:31','2025-04-22 17:58:32'),(35,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MTQ1NiwiZXhwIjoxNzQ1MzQ1MDU2fQ.zvySzpZ4pjDYXXqazPSh5iMXiISoC3Q-cAe9GJPaSBA','2025-04-22 17:04:16','2025-04-22 18:04:16'),(36,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MjE2MiwiZXhwIjoxNzQ1MzQ1NzYyfQ.mcW6HLCJxl5RJ5TBJXow3oX4PztdrCmk5q8auw-WZo0','2025-04-22 17:16:02','2025-04-22 18:16:03'),(37,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MjI0NSwiZXhwIjoxNzQ1MzQ1ODQ1fQ.I2vAVg9e_ETZGMlmLrk3GI0bQwXWAnwuFPXzUC12cvg','2025-04-22 17:17:25','2025-04-22 18:17:25'),(38,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MzQ0NywiZXhwIjoxNzQ1MzQ3MDQ3fQ.1EDVrTZ8c4J6gc_hdt5Gk1kk9XdLUuaIyUmBcdGOIcY','2025-04-22 17:37:27','2025-04-22 18:37:27'),(39,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0NDIzNCwiZXhwIjoxNzQ1MzQ3ODM0fQ.25akbVn0A3-NM_NKcDG7tsV-9rGcH8HjZ0Z5HR0Pq8A','2025-04-22 17:50:34','2025-04-22 18:50:35'),(40,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0NDI0MSwiZXhwIjoxNzQ1MzQ3ODQxfQ.8JeRgAnudLbiu4_u9Fylj2_sWmJ2uIr4kW10IKPJG74','2025-04-22 17:50:41','2025-04-22 18:50:42'),(41,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0NTUyMiwiZXhwIjoxNzQ1MzQ5MTIyfQ.G57go5HiB2jzjhHLHIO2n4YZY_2IQsnSor0dXS9vG-Q','2025-04-22 18:12:02','2025-04-22 19:12:03'),(42,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0Njg3MywiZXhwIjoxNzQ1MzUwNDczfQ.Vs6CjO0uZesFPmTcBCvy5SpgL_oaF_VNsEk4mCrK-rY','2025-04-22 18:34:33','2025-04-22 19:34:33'),(44,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MDc1MywiZXhwIjoxNzQ1MzU0MzUzfQ.lHEPVznnxISNPh6WxUIVIWhm8zt2Fv2ANuFtIiEi_aA','2025-04-22 19:39:13','2025-04-22 20:39:13'),(45,52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUyLCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MTExNiwiZXhwIjoxNzQ1MzU0NzE2fQ.WzjmcQsxBXtBvrIJTl9n4SrOOYuMOavonJtr6AL43Us','2025-04-22 19:45:16','2025-04-22 20:45:17'),(46,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MTU1NCwiZXhwIjoxNzQ1MzU1MTU0fQ.7bJEyO4KUNnbVWDfeyW9Fcgx1M5r0pNlzlzbFgL-ISI','2025-04-22 19:52:34','2025-04-22 20:52:34'),(47,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MjI0NiwiZXhwIjoxNzQ1MzU1ODQ2fQ.emhI46Qrz_jsSPHk8vatfqeLMkhmUXJbvP3GhxC-Lqo','2025-04-22 20:04:06','2025-04-22 21:04:06'),(56,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MzUyNSwiZXhwIjoxNzQ1MzU3MTI1fQ.wuNqDTj46mXiT5dwHjGQLnoAzaJpXGobBIbZzoNnz6c','2025-04-22 20:25:25','2025-04-22 21:25:25'),(64,51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUxLCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1NTExMywiZXhwIjoxNzQ1MzU4NzEzfQ.Mo024YFtLbPOrnvPCq0tzPKFE-iBNZuM6PpK5kIuIrs','2025-04-22 20:51:53','2025-04-22 21:51:53'),(71,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1NjYzNiwiZXhwIjoxNzQ1MzYwMjM2fQ.xdj02rxwmsX8Bjt35PHn-6nKBr_LqGTDK5ddrysHcnY','2025-04-22 21:17:16','2025-04-22 22:17:16'),(73,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc1Nzg0OTA4MiwiZXhwIjoxNzU3ODUyNjgyfQ.iFLIutDqKuaP61JfehBncAMCdw6KCZ_UwVpYq68JXDo','2025-09-14 11:24:42','2025-09-14 12:24:43'),(75,39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1ODU1NzM1NSwiZXhwIjoxNzU4NTYwOTU1fQ.e0qbT6G6tZIQxEImaj40AVf2yJkJ9A-FOOSzH8o0Fx0','2025-09-22 16:09:15','2025-09-22 17:09:16'),(77,39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1ODU2NzAwMSwiZXhwIjoxNzU4NTcwNjAxfQ.dQzBopFY0hcw6ghcEaMSmh8RD_A6X5yxJddr35mEPzY','2025-09-22 18:50:01','2025-09-22 19:50:01'),(78,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MTcwNiwiZXhwIjoxNzU5MTc1MzA2fQ.-4-05jCfjr4xRfW6gO2fjJRq0ZYkKCdSgqyUf4_cqRs','2025-09-29 18:48:26','2025-09-29 19:48:26'),(79,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MTc5OCwiZXhwIjoxNzU5MTc1Mzk4fQ.njDYBUrO8C6XoMRmCMoCmJqvMD7MpCeZ8hXJCaEqXYU','2025-09-29 18:49:58','2025-09-29 19:49:59'),(80,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MTgxMiwiZXhwIjoxNzU5MTc1NDEyfQ.GFObfsAfUiPloP4B3j76GxEnNfSX1-KVUmhVYxtpwcg','2025-09-29 18:50:12','2025-09-29 19:50:13'),(81,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MzQxNywiZXhwIjoxNzU5MTc3MDE3fQ._MaTadBS2MlZM-K-Yl4TabBSPRQtk5Xe5fI-yZdeM_A','2025-09-29 19:16:57','2025-09-29 20:16:57'),(82,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MzU1MSwiZXhwIjoxNzU5MTc3MTUxfQ.9dhkhj17dAWg1w96ExNEupSfjDYVBRzMoH_AOVLo6Ss','2025-09-29 19:19:11','2025-09-29 20:19:11'),(83,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3Mzc0MywiZXhwIjoxNzU5MTc3MzQzfQ.6XVOwJK2J7xQNzhjiRQ2DcScBK8LNGTFlO-ZvXNdER4','2025-09-29 19:22:23','2025-09-29 20:22:24'),(84,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NDUxNywiZXhwIjoxNzU5MTc4MTE3fQ.iribUx_q5QVsS3TbCMNooeYRiw0Li93cizFCDBPPXYE','2025-09-29 19:35:17','2025-09-29 20:35:18'),(85,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NTI5OCwiZXhwIjoxNzU5MTc4ODk4fQ.gepTdioGHTjj8sc5f0kcYPAqf2m3mZ7qGGw06LvMy8w','2025-09-29 19:48:18','2025-09-29 20:48:18'),(86,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NTk5NiwiZXhwIjoxNzU5MTc5NTk2fQ.oBpxKya05YcZCKAdnsJRBidwudjBOIlwzJbQeZqjcXA','2025-09-29 19:59:56','2025-09-29 20:59:56'),(87,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NjY5NSwiZXhwIjoxNzU5MTgwMjk1fQ.RzKJKNse6oFwsy9FYqEe2v1h2lqB51LAtzUYCJbgJqE','2025-09-29 20:11:35','2025-09-29 21:11:35'),(88,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDA4NTc4NywiZXhwIjoxNzYwMDg5Mzg3fQ.03Teo-NzqXk0rSUKfeaws220-thmaUl3jB9DkwOB-3Q','2025-10-10 08:43:07','2025-10-10 09:43:07'),(89,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDI5NzY2MCwiZXhwIjoxNzYwMzAxMjYwfQ.obUX27IRc0kv_PW1b3RKe1RCfLaF1ToesiqmjmxmIAM','2025-10-12 19:34:20','2025-10-12 20:34:21'),(90,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMTA0NiwiZXhwIjoxNzYwMzA0NjQ2fQ.juRxhvw1TSypfVUI5hc_Grh0-eHAuRoVNMh9-O3i6ME','2025-10-12 20:30:46','2025-10-12 21:30:47'),(91,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMTg4NywiZXhwIjoxNzYwMzA1NDg3fQ.QaZZOUUpG8vnIiQH6Dy67le_ggL0RI0Iy5Q20H_7lTs','2025-10-12 20:44:47','2025-10-12 21:44:48'),(92,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMjI1MywiZXhwIjoxNzYwMzA1ODUzfQ.GI9HIvOjPbLjrDezMJz7JL_xnHIUk3ShhNGN9n5z-DM','2025-10-12 20:50:53','2025-10-12 21:50:53'),(93,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMzA3NCwiZXhwIjoxNzYwMzA2Njc0fQ.bV6TbSMDqOkObk0YBv55pGo4R15zYncItZoMdQozwaU','2025-10-12 21:04:34','2025-10-12 22:04:35'),(94,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwNDQxMSwiZXhwIjoxNzYwMzA4MDExfQ.rojrUiHTjKuDUjFexHwiMolQEJTRfeejtww8ICz8lIU','2025-10-12 21:26:51','2025-10-12 22:26:52'),(95,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0NDQzOSwiZXhwIjoxNzYwMzQ4MDM5fQ.x24uk-RbfIi1bmIw3_6NeaiUQXwHmMVO9x8c6ZHHgo4','2025-10-13 08:33:59','2025-10-13 09:34:00'),(96,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0NDQ2OSwiZXhwIjoxNzYwMzQ4MDY5fQ.Up_kUYcT2ziDE0zNDGPh1BNlnVk9sYGKMfshu8PUG2I','2025-10-13 08:34:29','2025-10-13 09:34:29'),(97,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0NTM2MSwiZXhwIjoxNzYwMzQ4OTYxfQ.gDDkQZnSw2Ej7qZgff2yiAn6FEHo364Jvb8pallx_FU','2025-10-13 08:49:21','2025-10-13 09:49:22'),(98,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0ODcxNywiZXhwIjoxNzYwMzUyMzE3fQ.f3RCZftZ6bZXgtS5Xogrh0J7oOiJ9_kL4lb1xB7pwoo','2025-10-13 09:45:17','2025-10-13 10:45:18'),(99,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM3OTQ4OCwiZXhwIjoxNzYwMzgzMDg4fQ.Lp1h1SJR8oB-Yv36L6KZXHVwqT9b_FgTJXI2n11CIvY','2025-10-13 18:18:08','2025-10-13 19:18:09'),(100,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2MTExMSwiZXhwIjoxNzYxNzY0NzExfQ.QfTDEz_tL7NS6IpjxmIBxymB4987FGH89z_55Z2NgS8','2025-10-29 18:05:11','2025-10-29 19:05:11'),(101,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2MTUxNCwiZXhwIjoxNzYxNzY1MTE0fQ.RG4ILu-nqXMql9Py0yquF3lzixLPMT8SNfflf29We3k','2025-10-29 18:11:54','2025-10-29 19:11:54'),(102,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2Mjc4MSwiZXhwIjoxNzYxNzY2MzgxfQ.d49jpW-smdbhxGHt7UfRtF5hkrkiM-AOMGO8IRUbA-I','2025-10-29 18:33:01','2025-10-29 19:33:01'),(103,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2MzA4NiwiZXhwIjoxNzYxNzY2Njg2fQ.GQPnrwpP9nGbEzN3ETqHFXUpyQi8u_UpSAM18QDd4d0','2025-10-29 18:38:06','2025-10-29 19:38:07'),(104,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc2NDMxMjk2OSwiZXhwIjoxNzY0MzE2NTY5fQ.HH33qx5AIK3HOK88OGMbAeA1AhLw5MVK2-LWQbLEIoY','2025-11-28 06:56:09','2025-11-28 07:56:10'),(105,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2NDMxMjk3NywiZXhwIjoxNzY0MzE2NTc3fQ.FqSJ7f5ATZ73ySjsQrvU6-i-EHyTl3v82iVeTbrDZAU','2025-11-28 06:56:17','2025-11-28 07:56:17'),(106,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2NDMxMzM5NCwiZXhwIjoxNzY0MzE2OTk0fQ.dnXFUoJ4iPs_tQia0NA8coOoqB3pwVcyOBGHCcpjCsg','2025-11-28 07:03:14','2025-11-28 08:03:15'),(107,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTI4NDI5MywiZXhwIjoxNzY5Mjg3ODkzfQ.dYJoOUj2xsKFuRsETJ8kbpxL-2HI0jt4Nj7H9XtPpEA','2026-01-24 19:51:34','2026-01-24 20:51:34'),(108,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTYxODMyOSwiZXhwIjoxNzY5NjIxOTI5fQ.lq_GpFhZ00nb6V8sof-QR_ClYNUpBw4sCyHg7bKB3kM','2026-01-28 16:38:49','2026-01-28 17:38:49'),(109,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTYyMTU1NCwiZXhwIjoxNzY5NjI1MTU0fQ.RJfxj14AbCz5yi202U20wwZHtHyZDnbpoo3iDWTV1eI','2026-01-28 17:32:34','2026-01-28 18:32:34'),(110,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTYyMTk1NCwiZXhwIjoxNzY5NjI1NTU0fQ.UM-69gw7bE5IIztameYUuukP-etc3cWVUTj2rUlj4bM','2026-01-28 17:39:14','2026-01-28 18:39:14'),(111,59,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU5LCJyb2xlIjo3LCJjb21wYW55SWQiOm51bGwsImlhdCI6MTc2OTYyMjEwOCwiZXhwIjoxNzY5NjI1NzA4fQ.Zs8z0i0-mxzpTmqOnJqnJqx7l0kYQlEhxwOryRTQpao','2026-01-28 17:41:48','2026-01-28 18:41:48'),(112,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzA2NywiZXhwIjoxNzY5NzEwNjY3fQ.VaSHuwuiX46rT6zI9uNUTJDTBpk3ZZ7k6tG4nAJLhWY','2026-01-29 17:17:47','2026-01-29 18:17:48'),(113,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzEwOCwiZXhwIjoxNzY5NzEwNzA4fQ.eCTwdD4upKiyZr0u3l9I7_qqCfrNbvCPfukg9cCWCnM','2026-01-29 17:18:28','2026-01-29 18:18:28'),(114,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzE2NSwiZXhwIjoxNzY5NzEwNzY1fQ.OwaUeFhpEz6tWwgKrrt-4Lo2GTpm4JBztzUVo21OVtA','2026-01-29 17:19:25','2026-01-29 18:19:26'),(115,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzIwNSwiZXhwIjoxNzY5NzEwODA1fQ.nFGygcqhRkWYCRzZd09XlcYzNrYZ_eKtBROtUzxbOPE','2026-01-29 17:20:05','2026-01-29 18:20:05'),(116,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc4ODk1OSwiZXhwIjoxNzY5NzkyNTU5fQ.0v8he4SKMhFZekqWaGKfk6I7wfK--5_IYfmrp7uQ7yk','2026-01-30 16:02:39','2026-01-30 17:02:39'),(117,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc4OTA1MiwiZXhwIjoxNzY5NzkyNjUyfQ.KbjQQ4VkEHWkENNdSZO-n2ODfoKofvpWksU2Fs7xRFU','2026-01-30 16:04:12','2026-01-30 17:04:13'),(118,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc5MDQ5OCwiZXhwIjoxNzY5Nzk0MDk4fQ.aNRujctTYqc5zpqLS5bi7Z6pLN766rDPt2m0O9T5rQ0','2026-01-30 16:28:18','2026-01-30 17:28:19'),(119,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc5NDMyOCwiZXhwIjoxNzY5Nzk3OTI4fQ.jO_VisdwV809OUJDd6PK11FcQgTujgFJYimHyDMlJms','2026-01-30 17:32:08','2026-01-30 18:32:09'),(120,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg3NzA3NCwiZXhwIjoxNzY5ODgwNjc0fQ.v7UizaaKYAgmqCHUb0LmBQzLeLjfABprJP3GH4ABB7I','2026-01-31 16:31:14','2026-01-31 17:31:15'),(121,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4NzE4MSwiZXhwIjoxNzY5ODkwNzgxfQ.ZINo9hqbtBkFKB6OB2_s4fsHMTG5BdpkfLlF7fYUuvE','2026-01-31 19:19:41','2026-01-31 20:19:41'),(122,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4ODA2MCwiZXhwIjoxNzY5ODkxNjYwfQ.KFxcuPF4hbW9avqG5os2ZGWR6g5y0fKi0P__vS1vSXw','2026-01-31 19:34:20','2026-01-31 20:34:20'),(123,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4ODIzNSwiZXhwIjoxNzY5ODkxODM1fQ.XygQYbA5uK8mcMoZp4HV65el6ZcM_HiMY6mRQhvn1fo','2026-01-31 19:37:15','2026-01-31 20:37:15'),(124,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4ODM4MiwiZXhwIjoxNzY5ODkxOTgyfQ.2lfE-WuBRYu3qhbqx1-V-tLwEYAKUygcmrMywO4TvTc','2026-01-31 19:39:42','2026-01-31 20:39:43'),(125,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTkyNzY2MiwiZXhwIjoxNzY5OTMxMjYyfQ.nMlhXOZUj4akP9dxeiKYeXlAm7ifZzUbwA5n_GQnINY','2026-02-01 06:34:22','2026-02-01 07:34:23'),(126,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTkzNzY0MSwiZXhwIjoxNzY5OTQxMjQxfQ.8su_8vXKrvUU4Hrj5noPfCI0UKaxW37SubUHHJFJKVc','2026-02-01 09:20:41','2026-02-01 10:20:41'),(127,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTkzOTMxNywiZXhwIjoxNzY5OTQyOTE3fQ.A-xmfVA2p1MtHkgUjTMP7g5WhGJnKi2-EFXMLLD4Zkw','2026-02-01 09:48:37','2026-02-01 10:48:37'),(128,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTk0MDM0MiwiZXhwIjoxNzY5OTQzOTQyfQ.aAmytHzj4XxWX7GXm52zUBTsN3F3ugHLTt75k35CfUQ','2026-02-01 10:05:42','2026-02-01 11:05:42'),(129,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTk0NTA4NywiZXhwIjoxNzY5OTQ4Njg3fQ.2Vymb_YVZPMxZU5BK1wWHUmKlu9y_1fNEhAXaj_9mSk','2026-02-01 11:24:47','2026-02-01 12:24:48');
/*!40000 ALTER TABLE `user_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `enabled` tinyint(1) DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'inactive',
  `failed_attempts` int DEFAULT '0',
  `last_login` timestamp NULL DEFAULT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `company_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  KEY `fk_company` (`company_id`),
  CONSTRAINT `fk_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'test15','tes15@xyz.c','$2a$10$b0BgbLGghLLJ8BjgWFEHdeISMEGy.sepbIUKcX20ytYyJl8FV739q',1,1,'active',0,NULL,NULL,'2025-02-12 15:54:43','2025-02-12 15:54:09','2025-04-22 19:39:50',1,NULL,NULL),(31,'testuser5','osukacollins76@gmail.com','$2a$10$19K9hkK6zjlWvMne6bvpu..r1VmhrHXZlIYFxwGI.Bz8/5bAcanVm',1,1,'active',0,'2025-03-27 06:31:36',NULL,'2025-03-27 06:26:49','2025-03-27 06:26:20','2025-03-27 06:37:39',1,NULL,NULL),(33,'siteadmin','siteadmin@nifca.com','$2a$10$oxBrDVhouyIVgjKnWZHIvuWgxyAr9gQgP//vLjGtFDWHl6Cj2UZZ6',1,1,'active',0,'2026-01-30 16:04:12',NULL,'2025-03-27 13:27:44','2025-03-27 13:27:44','2026-01-30 16:04:12',1,NULL,NULL),(36,'tempadmin','tempadmin@nifca.com','$2a$10$yHJi64R1Sck6C4Ju3IiugOc6EivheiwD9U30sMGPvIJo7hCD1rZce',2,0,'inactive',0,NULL,'836739127c20c2b9659c39ad2d2d0f6a06af5f8e23644aefe62165c8d35bfc21',NULL,'2025-03-28 08:25:20','2025-03-28 08:25:20',1,33,NULL),(38,'contentadmin','contentadmin@nifca.com','$2a$10$2Io5SImG/k1WX/8ioEXN.eeRwILdBQ6zNa9Gtv45iZ2X7TMds.n9.',2,0,'active',1,'2025-03-29 08:59:34',NULL,'2025-03-29 07:41:22','2025-03-29 07:40:51','2025-09-14 11:23:20',1,33,NULL),(39,'contentadmin2','contentadmin2@nifca.com','$2a$10$oS6AKKk4HmUPWGReiYQk7eMXq56ztCwzZPJoFuEhyt4.QctvDscPy',2,1,'active',0,'2025-09-22 18:50:01',NULL,'2025-03-29 09:58:55','2025-03-29 09:57:25','2025-09-22 18:50:01',1,33,NULL),(40,'appadmin2','test@xyz.com','$2a$10$FkHMh12P.aiKDrVd6GINbO2SFi7uOr7N.YS7l9PLheFqjwJuM0CrS',3,1,'active',1,'2025-03-29 11:01:42',NULL,'2025-03-29 10:50:09','2025-03-29 10:49:33','2025-04-22 18:23:11',1,33,NULL),(42,'appadmin','appadmin@nifca.com','$2a$10$y5RLwnGpgPB0/ps6KubtJec58zbLaSTLCJzi7xkOtXqVvko.l4yty',3,1,'active',0,'2026-01-29 17:20:05',NULL,'2026-01-29 17:17:41','2025-04-19 10:40:12','2026-01-29 17:20:05',1,33,NULL),(43,'allenpane','test@xyz.co','$2a$10$6UCXSQ0HNqupA8acsSSRLunRb5frVHsFj1gH15MPG8AVfxBfzkak6',2,0,'active',0,NULL,NULL,'2025-04-22 18:33:34','2025-04-22 18:24:54','2025-04-22 18:36:31',1,33,NULL),(45,'test','test@xyz.c','$2a$10$bppdrYJVm1ScnNh648UOIuTvR3pZzrrxLCTjat7D2.xF3UkVDWlGG',2,0,'inactive',0,NULL,'2f3fb752ec49c2df1f296579766de605bd37c70d08e53aa7782175414a780e69',NULL,'2025-04-22 18:38:46','2025-04-22 18:49:29',1,33,NULL),(47,'test47','test47@xyz.c','$2a$10$WlKE/QZiHn8i5t4pB.AeFOO21T7D2mGA59LSnsuewgLb8Uv9Ac3P.',2,0,'inactive',0,NULL,'be8c3121600b8a115d674ff1259529b51ccdc5a10408c8d6646515ace30c1692',NULL,'2025-04-22 18:52:09','2025-04-22 18:54:27',1,33,NULL),(48,'test48','test48@xyz.c','$2a$10$u9DcZG8jOW5s3k1bDzaN2emP1fAoXxUaLzIRgHwlsKxh5/sq0gl7O',2,0,'inactive',0,NULL,'468b9ba68321a0d5ecfe2007f8e243ce6b13a4d4557fbfe760ac11b079afb584',NULL,'2025-04-22 18:54:41','2025-04-22 18:57:27',1,33,NULL),(49,'test49','test49@xyz.c','$2a$10$dUxD0BskpJZH5uZUP7UwWOQvyS.fFGibvPu6Z3QXUJcpJ3yrTF8QG',2,0,'inactive',0,NULL,'6e357a31931010c84e1c3a0a4524847d1d826b95a955ec5ad0caa295c36e6e2c',NULL,'2025-04-22 18:58:57','2025-04-22 19:07:21',1,33,NULL),(50,'test50','tes509@xyz.c','$2a$10$yVKoDkSVX5sGaNf5vH8lk.7V/riMYhKLaXPJVDsCHjoeGtwPeCFVK',2,0,'inactive',0,NULL,'beaadf89d9e4b1c4c29f9bcd126f8888625c12a8f3e5cfe29f2d693997f62b0b',NULL,'2025-04-22 19:10:15','2025-04-22 19:30:59',1,33,NULL),(51,'allenpane399@gmail.com','test@mail.com','$2a$10$GqsNYd4wOB5db9.rzieyEedK7azEBndF/NA3oFMtnSbR5HZgjg9gW',2,1,'active',2,'2025-04-22 20:51:53',NULL,'2025-04-22 19:35:29','2025-04-22 19:31:50','2025-09-14 11:27:49',1,33,NULL),(52,'test15c','tes15@xyz.oc','$2a$10$.ijveiAR9PsTT3GRPxljo.N/pd.RExIJnGVLundrrL5YWZQ5DpL2K',2,0,'active',0,'2025-04-22 19:45:16',NULL,'2025-04-22 19:44:46','2025-04-22 19:40:39','2025-04-22 19:53:11',1,33,NULL),(53,'test15co','tes15@xyz.coc','$2a$10$s2x2wsZWa/465QNRUkDPpOLbagaup8sC/EqMhOSAp4m.gRHcjvTl2',3,0,'inactive',0,NULL,'2386a39e38e3a0057d9743f77d9072871bae902d2d8c34c4107f4abef446b0f2',NULL,'2025-04-22 19:54:07','2025-04-22 20:03:54',1,33,NULL),(54,'test15com','tes15@xyz.cocm','$2a$10$WFpOVomDh1Y2aY7SshRgieDuGczhRTWqCNP547vz5trbhKIhcCMzi',2,1,'inactive',0,NULL,'152cce146036029e91a34c90bb94df279f2a54a4ae371becda3fa23dc49e535f',NULL,'2025-04-22 20:04:35','2025-04-22 20:09:09',1,33,NULL),(55,'osuka','osukasavin2001@gmail.com','$2a$10$nqYKXxfNehzeRcWSNKv0yejcZMyos.ZceH/k5RTP6gpGw9dlMPJnS',3,1,'active',0,'2026-02-01 11:24:47',NULL,'2025-04-22 20:06:49','2025-04-22 20:06:29','2026-02-01 11:24:47',1,33,NULL),(56,'contentuser','contentuser@mail.com','$2a$10$a9mrOrooDh3vkuODd7ZOr.hPbLineUm/7gEZ5/Z4evK9NjDkkq3kC',2,1,'active',0,'2025-09-14 11:44:41',NULL,'2025-09-14 11:41:15','2025-09-14 11:29:23','2025-09-14 11:44:41',1,33,NULL),(58,'apptest','allenpane39@gmail.com','$2a$10$pIm2ky7WCKE8cR8Ug3rhAuG.2rnp.R3PwOAFr.4DOxyHstVmoOxEq',3,0,'inactive',0,NULL,'abb7144322409faea02feaa263a7888312a095b10e5c850d3674426f7cc3b058',NULL,'2026-01-28 16:39:36','2026-01-30 16:34:08',1,33,NULL),(59,'testclient','testclient@nifca.com','$2a$10$XGDgU7700f4MGcw9gjOt.upDYSpLwKAaH.HCvaPZT0Ch3Zts4n/m.',7,1,'active',0,'2026-01-28 17:41:48',NULL,'2026-01-28 17:41:19','2026-01-28 17:41:19','2026-01-28 17:41:48',NULL,NULL,NULL);
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

-- Dump completed on 2026-02-01 20:00:17
