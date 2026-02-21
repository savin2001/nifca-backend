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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_audit_log`
--

LOCK TABLES `application_audit_log` WRITE;
/*!40000 ALTER TABLE `application_audit_log` DISABLE KEYS */;
INSERT INTO `application_audit_log` VALUES (4,9,'review',42,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"under_review\", \"reviewed_by\": 42, \"review_comments\": \"Application is under review. Additional documents may be requested.\"}','2026-01-29 20:17:48'),(5,10,'review',42,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"under_review\", \"reviewed_by\": 42, \"review_comments\": \"Application is under review. Additional documents may be requested.\"}','2026-01-29 20:17:48'),(6,10,'status_change',42,'{\"status\": \"under_review\"}','{\"status\": \"approved\"}','2026-01-29 20:17:48'),(7,12,'status_change',42,'{\"status\": \"draft\"}','{\"status\": \"approved\"}','2026-01-29 20:18:28'),(8,14,'status_change',42,'{\"status\": \"draft\"}','{\"status\": \"approved\"}','2026-01-29 20:19:25'),(9,16,'status_change',42,'{\"status\": \"draft\"}','{\"status\": \"approved\"}','2026-01-29 20:20:05'),(10,23,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"approved\", \"reviewed_by\": 55, \"review_comments\": \"Approved\"}','2026-01-31 19:40:23'),(11,9,'review',55,'{\"status\": \"under_review\", \"reviewed_by\": 42, \"review_comments\": \"Application is under review. Additional documents may be requested.\"}','{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"test\"}','2026-01-31 20:01:35'),(12,9,'review',55,'{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"test\"}','{\"status\": \"rejected\", \"reviewed_by\": 55, \"review_comments\": \"rejected\"}','2026-01-31 20:02:08'),(13,30,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"rejected\", \"reviewed_by\": 55, \"review_comments\": \"no\"}','2026-01-31 22:22:34'),(14,18,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"approved\", \"reviewed_by\": 55, \"review_comments\": \"okay\"}','2026-01-31 22:53:29'),(15,35,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"Checking valid docs\"}','2026-02-01 13:30:24'),(16,35,'review',55,'{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"Checking valid docs\"}','{\"status\": \"pending\", \"reviewed_by\": 55, \"review_comments\": \"Add support documents missing\"}','2026-02-01 13:43:57'),(17,35,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": 55, \"review_comments\": \"Add support documents missing\"}','{\"status\": \"approved\", \"reviewed_by\": 55, \"review_comments\": \"All good. Welcome to Kenya\"}','2026-02-01 14:25:27'),(18,40,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": null, \"review_comments\": null}','{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"CHecking\"}','2026-02-03 21:10:12'),(19,40,'review',55,'{\"status\": \"under_review\", \"reviewed_by\": 55, \"review_comments\": \"CHecking\"}','{\"status\": \"pending\", \"reviewed_by\": 55, \"review_comments\": \"Add blah blah\"}','2026-02-03 21:10:49'),(20,40,'review',55,'{\"status\": \"submitted\", \"reviewed_by\": 55, \"review_comments\": \"Add blah blah\"}','{\"status\": \"approved\", \"reviewed_by\": 55, \"review_comments\": \"Mbele pamoja\"}','2026-02-03 21:11:42');
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
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_documents`
--

LOCK TABLES `application_documents` WRITE;
/*!40000 ALTER TABLE `application_documents` DISABLE KEYS */;
INSERT INTO `application_documents` VALUES (2,18,5,11,'certificate_of_incorporation','test_doc.pdf','doc_jw8ufg_1769792524232.pdf','assets/applications/18/doc_jw8ufg_1769792524232.pdf','application/pdf',44,13,'2026-01-30 20:02:04'),(3,18,5,12,'memorandum_articles','test_doc.pdf','doc_b6ppuh_1769792540806.pdf','assets/applications/18/doc_b6ppuh_1769792540806.pdf','application/pdf',44,13,'2026-01-30 20:02:20'),(4,18,5,13,'business_plan','test_doc.pdf','doc_dp98xo_1769792542989.pdf','assets/applications/18/doc_dp98xo_1769792542989.pdf','application/pdf',44,13,'2026-01-30 20:02:22'),(5,18,5,14,'financial_projections','test_doc.pdf','doc_qih0oz_1769792545192.pdf','assets/applications/18/doc_qih0oz_1769792545192.pdf','application/pdf',44,13,'2026-01-30 20:02:25'),(6,20,5,NULL,NULL,'The Immaculate Foundation.pdf','doc_cs5pgc_1769793476581.pdf','assets/applications/20/doc_cs5pgc_1769793476581.pdf','application/pdf',52128,13,'2026-01-30 20:17:56'),(7,21,5,NULL,NULL,'Certificate.pdf','doc_wot1um_1769794200565.pdf','assets/applications/21/doc_wot1um_1769794200565.pdf','application/pdf',52128,13,'2026-01-30 20:30:00'),(8,23,5,11,'certificate_of_incorporation','Certificate Inco.pdf','doc_r6poax_1769876911676.pdf','assets/applications/23/doc_r6poax_1769876911676.pdf','application/pdf',52128,13,'2026-01-31 19:28:31'),(9,23,5,12,'memorandum_articles','Memo.pdf','doc_1ziirj_1769876930205.pdf','assets/applications/23/doc_1ziirj_1769876930205.pdf','application/pdf',52128,13,'2026-01-31 19:28:50'),(10,23,5,13,'business_plan','Business Plan.pdf','doc_qc0j13_1769876952717.pdf','assets/applications/23/doc_qc0j13_1769876952717.pdf','application/pdf',52128,13,'2026-01-31 19:29:12'),(11,23,5,14,'financial_projections','Projections.pdf','doc_v7vhhb_1769876965498.pdf','assets/applications/23/doc_v7vhhb_1769876965498.pdf','application/pdf',52128,13,'2026-01-31 19:29:25'),(12,23,5,15,'additional_documents','MOU.pdf','doc_w1s3f1_1769876984696.pdf','assets/applications/23/doc_w1s3f1_1769876984696.pdf','application/pdf',52128,13,'2026-01-31 19:29:44'),(13,23,5,NULL,NULL,'Minutes.pdf','doc_2vxkr5_1769877000960.pdf','assets/applications/23/doc_2vxkr5_1769877000960.pdf','application/pdf',52128,13,'2026-01-31 19:30:00'),(14,27,5,11,'certificate_of_incorporation','NIFCA_Application_NIFCA-2026-00023.pdf','doc_kdx357_1769883614213.pdf','assets/applications/27/doc_kdx357_1769883614213.pdf','application/pdf',42106,13,'2026-01-31 21:20:14'),(15,27,5,12,'memorandum_articles','NIFCA_Application_NIFCA-2026-00023.pdf','doc_0apgef_1769883619658.pdf','assets/applications/27/doc_0apgef_1769883619658.pdf','application/pdf',42106,13,'2026-01-31 21:20:19'),(16,27,5,13,'business_plan','NIFCA_Application_NIFCA-2026-00023.pdf','doc_ufzkam_1769883625108.pdf','assets/applications/27/doc_ufzkam_1769883625108.pdf','application/pdf',42106,13,'2026-01-31 21:20:25'),(17,27,5,14,'financial_projections','NIFCA_Application_NIFCA-2026-00023.pdf','doc_gba5s7_1769883634333.pdf','assets/applications/27/doc_gba5s7_1769883634333.pdf','application/pdf',42106,13,'2026-01-31 21:20:34'),(18,27,5,15,'additional_documents','NIFCA_Application_NIFCA-2026-00023.pdf','doc_941zb8_1769883640529.pdf','assets/applications/27/doc_941zb8_1769883640529.pdf','application/pdf',42106,13,'2026-01-31 21:20:40'),(19,27,5,NULL,NULL,'NIFCA_Application_NIFCA-2026-00023.pdf','doc_5mkgbl_1769883646338.pdf','assets/applications/27/doc_5mkgbl_1769883646338.pdf','application/pdf',42106,13,'2026-01-31 21:20:46'),(20,27,5,NULL,NULL,'NIFCA_Application_NIFCA-2026-00023.pdf','doc_ag2sr0_1769883668826.pdf','assets/applications/27/doc_ag2sr0_1769883668826.pdf','application/pdf',42106,13,'2026-01-31 21:21:08'),(21,30,5,11,'certificate_of_incorporation','cert.pdf','doc_xkao6w_1769885468928.pdf','assets/applications/30/doc_xkao6w_1769885468928.pdf','application/pdf',42106,13,'2026-01-31 21:51:08'),(22,30,5,12,'memorandum_articles','memo.pdf','doc_w7fuv4_1769885475188.pdf','assets/applications/30/doc_w7fuv4_1769885475188.pdf','application/pdf',42106,13,'2026-01-31 21:51:15'),(23,30,5,13,'business_plan','business.pdf','doc_mqmkjj_1769885483430.pdf','assets/applications/30/doc_mqmkjj_1769885483430.pdf','application/pdf',42106,13,'2026-01-31 21:51:23'),(24,30,5,14,'financial_projections','projection.pdf','doc_ql5pat_1769885497865.pdf','assets/applications/30/doc_ql5pat_1769885497865.pdf','application/pdf',42106,13,'2026-01-31 21:51:37'),(25,30,5,15,'additional_documents','support1.pdf','doc_8u2gk1_1769885503308.pdf','assets/applications/30/doc_8u2gk1_1769885503308.pdf','application/pdf',42106,13,'2026-01-31 21:51:43'),(26,30,5,NULL,NULL,'support2.pdf','doc_hkjtez_1769885510273.pdf','assets/applications/30/doc_hkjtez_1769885510273.pdf','application/pdf',42106,13,'2026-01-31 21:51:50'),(27,30,5,NULL,NULL,'minutes.pdf','doc_n7a44t_1769885518207.pdf','assets/applications/30/doc_n7a44t_1769885518207.pdf','application/pdf',42106,13,'2026-01-31 21:51:58'),(28,35,5,11,'certificate_of_incorporation','cert.pdf','doc_g2gu00_1769940910015.pdf','assets/applications/35/doc_g2gu00_1769940910015.pdf','application/pdf',42106,13,'2026-02-01 13:15:10'),(29,35,5,12,'memorandum_articles','memo.pdf','doc_dviax0_1769940916537.pdf','assets/applications/35/doc_dviax0_1769940916537.pdf','application/pdf',42106,13,'2026-02-01 13:15:16'),(30,35,5,13,'business_plan','business.pdf','doc_cgoo41_1769940922961.pdf','assets/applications/35/doc_cgoo41_1769940922961.pdf','application/pdf',42106,13,'2026-02-01 13:15:22'),(31,35,5,14,'financial_projections','projection.pdf','doc_c5rb62_1769940929265.pdf','assets/applications/35/doc_c5rb62_1769940929265.pdf','application/pdf',42106,13,'2026-02-01 13:15:29'),(32,35,5,15,'additional_documents','support1.pdf','doc_uytlqc_1769940938539.pdf','assets/applications/35/doc_uytlqc_1769940938539.pdf','application/pdf',42106,13,'2026-02-01 13:15:38'),(33,40,5,11,'certificate_of_incorporation','cert.pdf','doc_fw76pt_1770142051844.pdf','assets/applications/40/doc_fw76pt_1770142051844.pdf','application/pdf',42106,13,'2026-02-03 21:07:31'),(34,40,5,12,'memorandum_articles','memo.pdf','doc_upwztm_1770142057228.pdf','assets/applications/40/doc_upwztm_1770142057228.pdf','application/pdf',42106,13,'2026-02-03 21:07:37'),(35,40,5,13,'business_plan','business.pdf','doc_8cn4ki_1770142062645.pdf','assets/applications/40/doc_8cn4ki_1770142062645.pdf','application/pdf',42106,13,'2026-02-03 21:07:42'),(36,40,5,14,'financial_projections','projection.pdf','doc_2n59gv_1770142068891.pdf','assets/applications/40/doc_2n59gv_1770142068891.pdf','application/pdf',42106,13,'2026-02-03 21:07:48'),(37,40,5,15,'additional_documents','NIFCA_Application_NIFCA-2026-00023 - Copy (2).pdf','doc_9huz6u_1770142073364.pdf','assets/applications/40/doc_9huz6u_1770142073364.pdf','application/pdf',42106,13,'2026-02-03 21:07:53'),(38,40,5,NULL,NULL,'minutes.pdf','doc_ixd6c9_1770142271752.pdf','assets/applications/40/doc_ixd6c9_1770142271752.pdf','application/pdf',42106,13,'2026-02-03 21:11:11'),(39,44,5,11,'certificate_of_incorporation','cert.pdf','doc_gvhjpv_1771604386628.pdf','assets/applications/44/doc_gvhjpv_1771604386628.pdf','application/pdf',42106,18,'2026-02-20 19:19:46'),(40,44,5,12,'memorandum_articles','memo.pdf','doc_k5660d_1771604394356.pdf','assets/applications/44/doc_k5660d_1771604394356.pdf','application/pdf',42106,18,'2026-02-20 19:19:54'),(41,44,5,13,'business_plan','business.pdf','doc_tp08ty_1771604403901.pdf','assets/applications/44/doc_tp08ty_1771604403901.pdf','application/pdf',42106,18,'2026-02-20 19:20:03'),(42,44,5,14,'financial_projections','projection.pdf','doc_j4km9s_1771604410316.pdf','assets/applications/44/doc_j4km9s_1771604410316.pdf','application/pdf',42106,18,'2026-02-20 19:20:10'),(43,44,5,15,'additional_documents','support1.pdf','doc_xy3iph_1771604418685.pdf','assets/applications/44/doc_xy3iph_1771604418685.pdf','application/pdf',42106,18,'2026-02-20 19:20:18'),(44,44,5,NULL,NULL,'support2.pdf','doc_uh6kic_1771604426801.pdf','assets/applications/44/doc_uh6kic_1771604426801.pdf','application/pdf',42106,18,'2026-02-20 19:20:26'),(45,43,5,11,'certificate_of_incorporation','cert.pdf','doc_98y1sz_1771644020137.pdf','assets/applications/43/doc_98y1sz_1771644020137.pdf','application/pdf',42106,18,'2026-02-21 06:20:20'),(46,43,5,12,'memorandum_articles','memo.pdf','doc_4ktmfl_1771644031863.pdf','assets/applications/43/doc_4ktmfl_1771644031863.pdf','application/pdf',42106,18,'2026-02-21 06:20:31'),(47,43,5,13,'business_plan','business.pdf','doc_y4h6td_1771644043440.pdf','assets/applications/43/doc_y4h6td_1771644043440.pdf','application/pdf',42106,18,'2026-02-21 06:20:43'),(48,43,5,14,'financial_projections','projection.pdf','doc_4d5r32_1771644054191.pdf','assets/applications/43/doc_4d5r32_1771644054191.pdf','application/pdf',42106,18,'2026-02-21 06:20:54'),(49,43,5,15,'additional_documents','support1.pdf','doc_szze8x_1771644071525.pdf','assets/applications/43/doc_szze8x_1771644071525.pdf','application/pdf',42106,18,'2026-02-21 06:21:11');
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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_section_data`
--

LOCK TABLES `application_section_data` WRITE;
/*!40000 ALTER TABLE `application_section_data` DISABLE KEYS */;
INSERT INTO `application_section_data` VALUES (1,11,1,'{\"company_name\": \"Test Company Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2020-01-15\", \"country_of_incorporation\": \"KE\"}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(2,11,2,'{}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(3,11,3,'{}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(4,11,4,'{}',0,NULL,'2026-01-29 20:18:27','2026-01-29 20:18:27'),(5,12,1,'{\"company_name\": \"Admin Test Company Ltd\", \"company_type\": \"PLC\", \"registration_number\": \"XYZ-789012\", \"date_of_incorporation\": \"2019-06-20\", \"country_of_incorporation\": \"UK\"}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(6,12,2,'{}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(7,12,3,'{}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(8,12,4,'{}',0,NULL,'2026-01-29 20:18:28','2026-01-29 20:18:28'),(9,13,1,'{\"company_name\": \"Test Company Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2020-01-15\", \"country_of_incorporation\": \"KE\"}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(10,13,2,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(11,13,3,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(12,13,4,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(13,14,1,'{\"company_name\": \"Admin Test Company Ltd\", \"company_type\": \"PLC\", \"registration_number\": \"XYZ-789012\", \"date_of_incorporation\": \"2019-06-20\", \"country_of_incorporation\": \"UK\"}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(14,14,2,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(15,14,3,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(16,14,4,'{}',0,NULL,'2026-01-29 20:19:25','2026-01-29 20:19:25'),(17,15,1,'{\"company_name\": \"Test Company Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2020-01-15\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(18,15,2,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(19,15,3,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(20,15,4,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:04','2026-01-29 20:20:04'),(21,16,1,'{\"company_name\": \"Admin Test Company Ltd\", \"company_type\": \"PLC\", \"registration_number\": \"XYZ-789012\", \"date_of_incorporation\": \"2019-06-20\", \"country_of_incorporation\": \"UK\"}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(22,16,2,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(23,16,3,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(24,16,4,'{}',1,'2026-01-29 20:20:05','2026-01-29 20:20:05','2026-01-29 20:20:05'),(25,18,1,'{\"company_name\": \"NIFCA Test Corporation Ltd\", \"company_type\": \"LLC\", \"registration_number\": \"KE-2026-12345\", \"date_of_incorporation\": \"2025-06-15\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-30 19:57:15','2026-01-30 19:56:04','2026-01-30 19:57:15'),(26,18,2,'{}',1,'2026-01-30 19:57:18','2026-01-30 19:56:34','2026-01-30 19:57:18'),(27,18,3,'{}',1,'2026-01-30 19:57:21','2026-01-30 19:56:37','2026-01-30 19:57:21'),(28,18,4,'{}',1,'2026-01-30 19:57:24','2026-01-30 19:56:40','2026-01-30 19:57:24'),(29,18,5,'{}',1,'2026-01-30 20:02:35','2026-01-30 19:56:43','2026-01-30 20:02:35'),(30,20,1,'{\"company_name\": \"Bazenga Limited\", \"company_type\": \"LLC\", \"registration_number\": \"123456789\", \"date_of_incorporation\": \"2009-02-22\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-30 20:15:05','2026-01-30 20:12:34','2026-01-30 20:15:05'),(31,20,2,'{}',1,'2026-01-30 20:15:15','2026-01-30 20:13:59','2026-01-30 20:15:14'),(32,20,3,'{}',0,NULL,'2026-01-30 20:14:04','2026-01-30 20:20:00'),(33,20,4,'{}',0,NULL,'2026-01-30 20:15:17','2026-01-30 20:19:58'),(34,20,5,'{}',0,NULL,'2026-01-30 20:18:00','2026-01-30 20:18:00'),(35,21,1,'{\"company_name\": \"test\", \"company_type\": \"LLC\", \"registration_number\": \"21432498354\", \"date_of_incorporation\": \"2009-02-02\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-30 20:24:00','2026-01-30 20:23:27','2026-01-30 20:23:59'),(36,21,2,'{\"contact_email\": \"nifcauser2026@example.com\", \"contact_phone\": \"254712345689\", \"physical_address\": \"Nairobi, Kenya\", \"contact_person_name\": \"Craft\"}',1,'2026-01-30 20:26:53','2026-01-30 20:24:42','2026-01-30 20:26:52'),(37,21,3,'{\"initial_capital\": 139999, \"proposed_activities\": [\"BANKING\", \"INSURANCE\"], \"business_plan_summary\": \"The company proposes to provide regulated financial services focused on digital banking and foreign exchange solutions. The core offering includes customer onboarding, account based transaction services, payments processing, and foreign currency exchange for individuals and small to medium enterprises. Services will be delivered through secure digital channels, supported by strong risk management, compliance, and customer due diligence frameworks aligned with regulatory requirements.\\n\\nThe business targets underserved and digitally active customers seeking efficient, transparent, and affordable financial services. Revenue will be generated through transaction fees, foreign exchange margins, and value added financial services. The company will prioritize financial inclusion, operational resilience, data security, and regulatory compliance while leveraging technology to improve service delivery and scalability.\", \"projected_annual_revenue\": 19996}',1,'2026-01-30 20:28:42','2026-01-30 20:27:00','2026-01-30 20:28:41'),(38,21,4,'{\"director_names\": \"Bazenga Dune Test\", \"beneficial_owners\": \"Bazenga Dune Test - 100%\", \"has_criminal_record\": \"no\", \"number_of_directors\": 1}',1,'2026-01-30 20:29:26','2026-01-30 20:28:46','2026-01-30 20:29:26'),(39,21,5,'{}',0,NULL,'2026-01-30 20:30:02','2026-01-30 20:30:02'),(40,22,1,'{\"company_name\": \"Best \"}',0,NULL,'2026-01-31 19:15:22','2026-01-31 19:15:22'),(41,23,1,'{\"company_name\": \"ABC Digital Finance Limited\", \"company_type\": \"BRANCH\", \"registration_number\": \"PVT-12345678\", \"date_of_incorporation\": \"2024-12-04\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-31 19:18:43','2026-01-31 19:17:18','2026-01-31 19:18:43'),(42,23,2,'{\"contact_email\": \"info@companyname.co.ke\", \"contact_phone\": \"254712345678\", \"postal_address\": \"P.O. Box 12345-00100, Nairobi\", \"physical_address\": \"Ngong Road, ABC Towers, 5th Floor, Nairobi, Kenya\", \"contact_person_name\": \"Savin Osuka\"}',1,'2026-01-31 19:25:47','2026-01-31 19:21:23','2026-01-31 19:25:47'),(43,23,3,'{\"initial_capital\": 100000, \"proposed_activities\": [\"FOREX\", \"BANKING\"], \"business_plan_summary\": \"The company proposes to offer digital financial services focused on banking and foreign exchange solutions for individuals and small to medium enterprises. Core services include account based transactions, payments facilitation, and foreign currency exchange delivered through secure digital platforms.\\n\\nThe target market includes SMEs, professionals, and digitally active customers seeking efficient, transparent, and affordable financial services. The business strategy emphasizes regulatory compliance, strong risk management, customer due diligence, and technology driven service delivery to ensure scalability, reliability, and financial inclusion.\", \"projected_annual_revenue\": 250000}',1,'2026-01-31 19:26:53','2026-01-31 19:26:16','2026-01-31 19:26:52'),(44,23,4,'{\"director_names\": \"Savin Osuka\\nJane Wanjiku Mwangi\", \"beneficial_owners\": \"Savin Osuka - 60%\\nJane Wanjiku Mwangi - 40%\", \"has_criminal_record\": \"no\", \"number_of_directors\": 2}',1,'2026-01-31 19:28:09','2026-01-31 19:27:22','2026-01-31 19:28:09'),(45,23,5,'{}',1,'2026-01-31 19:30:15','2026-01-31 19:30:15','2026-01-31 19:30:15'),(46,24,1,'{\"company_name\": \"Test\", \"company_type\": \"LLC\", \"registration_number\": \"9853534624\", \"date_of_incorporation\": \"2007-12-08\", \"country_of_incorporation\": \"US\"}',1,'2026-01-31 20:25:52','2026-01-31 20:11:49','2026-01-31 20:25:51'),(47,27,1,'{\"company_name\": \"Testng\", \"company_type\": \"LLC\", \"registration_number\": \"ABC-123456\", \"date_of_incorporation\": \"2009-09-09\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-31 21:17:53','2026-01-31 21:17:14','2026-01-31 21:17:53'),(48,27,2,'{\"contact_email\": \"ola@hot.le\", \"contact_phone\": \"254732456908\", \"postal_address\": \"dggrjrurye\\nfghetwetwytw\", \"physical_address\": \"wwrrtefgfhdghehjet\\nryeturyuetyert\", \"contact_person_name\": \"Monica Ochieng\"}',1,'2026-01-31 21:19:03','2026-01-31 21:18:02','2026-01-31 21:19:02'),(49,27,4,'{\"director_names\": \"Monica Awuor\", \"beneficial_owners\": \"Monica - 100%\", \"has_criminal_record\": \"yes\", \"number_of_directors\": 1}',1,'2026-01-31 21:19:59','2026-01-31 21:19:07','2026-01-31 21:19:58'),(50,27,5,'{}',1,'2026-01-31 21:21:12','2026-01-31 21:20:52','2026-01-31 21:21:11'),(51,30,1,'{\"company_name\": \"Ola Mi Amigo\", \"company_type\": \"PLC\", \"registration_number\": \"ABC-0987654\", \"date_of_incorporation\": \"2011-07-01\", \"country_of_incorporation\": \"KE\"}',1,'2026-01-31 21:44:29','2026-01-31 21:43:50','2026-01-31 21:44:29'),(52,30,2,'{\"contact_email\": \"monty@nowhere.kim\", \"contact_phone\": \"254789321456\", \"physical_address\": \"P.O. Box 12345-00100, Nairobi\", \"contact_person_name\": \"Monty\"}',1,'2026-01-31 21:46:52','2026-01-31 21:44:37','2026-01-31 21:46:52'),(53,30,3,'{\"initial_capital\": 31750, \"proposed_activities\": [\"BANKING\"], \"business_plan_summary\": \"The company proposes to offer digital financial services focused on banking and foreign exchange solutions for individuals and small to medium enterprises. Core services include account based transactions, payments facilitation, and foreign currency exchange delivered through secure digital platforms.\\n\\nThe target market includes SMEs, professionals, and digitally active customers seeking efficient, transparent, and affordable financial services. The business strategy emphasizes regulatory compliance, strong risk management, customer due diligence, and technology driven service delivery to ensure scalability, reliability, and financial inclusion.\", \"projected_annual_revenue\": 24000}',1,'2026-01-31 21:47:28','2026-01-31 21:46:57','2026-01-31 21:47:28'),(54,30,4,'{\"director_names\": \"Savin Osuka\\nJane Wanjiku Mwangi\", \"beneficial_owners\": \"Savin Osuka - 60%\\nJane Wanjiku Mwangi - 40%\", \"has_criminal_record\": \"no\", \"number_of_directors\": 2}',1,'2026-01-31 21:48:09','2026-01-31 21:47:48','2026-01-31 21:48:09'),(55,30,5,'{}',1,'2026-01-31 21:52:08','2026-01-31 21:52:07','2026-01-31 21:52:07'),(56,38,1,'{\"company_name\": \"Test2\", \"company_type\": \"BRANCH\", \"registration_number\": \"123456\", \"date_of_incorporation\": \"2012-12-12\", \"country_of_incorporation\": \"KE\"}',1,'2026-02-01 13:08:02','2026-02-01 13:06:47','2026-02-01 13:08:02'),(57,35,1,'{\"company_name\": \"What The Hell\", \"company_type\": \"BRANCH\", \"registration_number\": \"XYZ-2345678\", \"date_of_incorporation\": \"2003-01-02\", \"country_of_incorporation\": \"US\"}',1,'2026-02-01 13:11:30','2026-02-01 13:08:37','2026-02-01 13:11:29'),(58,35,2,'{\"contact_email\": \"juli@test.com\", \"contact_phone\": \"+254746172500\", \"postal_address\": \"P.O. Box. 2345, Nairobi\", \"physical_address\": \"Canaan Estate, Nairobi\", \"contact_person_name\": \"Julie\"}',1,'2026-02-01 13:13:32','2026-02-01 13:11:34','2026-02-01 13:13:32'),(59,35,3,'{\"initial_capital\": 3420001, \"proposed_activities\": [\"FUND_MGMT\"], \"business_plan_summary\": \"Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.Adding and updating oending records.\", \"projected_annual_revenue\": 1200000}',1,'2026-02-01 13:14:13','2026-02-01 13:13:39','2026-02-01 13:14:12'),(60,35,4,'{\"director_names\": \"Julie\\nJames\", \"beneficial_owners\": \"Julie - 70%\\nJames - 30%\", \"has_criminal_record\": \"yes\", \"number_of_directors\": 2}',1,'2026-02-01 14:23:33','2026-02-01 13:14:22','2026-02-01 14:23:32'),(61,35,5,'{}',1,'2026-02-01 14:23:35','2026-02-01 13:15:44','2026-02-01 14:23:34'),(62,39,1,'{\"company_name\": \"ejkFHJWAEF\", \"company_type\": \"LLC\", \"registration_number\": \"DLFAOIR\", \"date_of_incorporation\": \"2025-02-17\", \"country_of_incorporation\": \"KE\"}',1,'2026-02-03 07:22:24','2026-02-03 07:21:50','2026-02-03 07:22:24'),(63,39,2,'{}',0,NULL,'2026-02-03 07:22:28','2026-02-03 07:22:28'),(64,40,1,'{\"company_name\": \"Cipher Tech\", \"company_type\": \"LLC\", \"registration_number\": \"ABD-123456789\", \"date_of_incorporation\": \"2020-03-03\", \"country_of_incorporation\": \"KE\"}',1,'2026-02-03 21:03:04','2026-02-03 21:02:00','2026-02-03 21:03:03'),(65,40,2,'{\"contact_email\": \"cipherjohn254@gmail.com\", \"contact_phone\": \"2547462712500\", \"postal_address\": \"P.O. Box 12345-00100, Nairobi\", \"physical_address\": \"Ngong Road, ABC Towers, 5th Floor, Nairobi, Kenya\", \"contact_person_name\": \"Cipher\"}',1,'2026-02-03 21:06:39','2026-02-03 21:03:11','2026-02-03 21:06:39'),(66,40,3,'{\"initial_capital\": 462646, \"proposed_activities\": [\"SECURITIES\", \"FUND_MGMT\"], \"business_plan_summary\": \"The company proposes to offer digital financial services focused on banking and foreign exchange solutions for individuals and small to medium enterprises. Core services include account based transactions, payments facilitation, and foreign currency exchange delivered through secure digital platforms.\\n\\nThe target market includes SMEs, professionals, and digitally active customers seeking efficient, transparent, and affordable financial services. The business strategy emphasizes regulatory compliance, strong risk management, customer due diligence, and technology driven service delivery to ensure scalability, reliability, and financial inclusion.\", \"projected_annual_revenue\": 10953252}',1,'2026-02-03 21:06:56','2026-02-03 21:06:42','2026-02-03 21:06:55'),(67,40,4,'{\"director_names\": \"Cipher\", \"beneficial_owners\": \"Cipher - 100\", \"has_criminal_record\": \"no\", \"number_of_directors\": 1}',1,'2026-02-03 21:07:19','2026-02-03 21:06:59','2026-02-03 21:07:18'),(68,40,5,'{}',1,'2026-02-03 21:11:13','2026-02-03 21:07:56','2026-02-03 21:11:13'),(69,41,1,'{\"company_name\": \"Captcha Test\"}',0,NULL,'2026-02-11 18:35:14','2026-02-11 18:35:19'),(70,44,1,'{\"company_name\": \"Test Company\", \"company_type\": \"LLC\", \"registration_number\": \"OCD-1234567\", \"date_of_incorporation\": \"2026-02-02\", \"country_of_incorporation\": \"KE\"}',1,'2026-02-20 19:16:55','2026-02-20 19:15:58','2026-02-20 19:16:55'),(71,44,2,'{\"contact_email\": \"hello@test.com\", \"contact_phone\": \"+254746172500\", \"postal_address\": \"12345\", \"physical_address\": \"Location 1\", \"contact_person_name\": \"Hello\"}',1,'2026-02-20 19:18:31','2026-02-20 19:17:36','2026-02-20 19:18:30'),(72,44,3,'{\"initial_capital\": 25000, \"proposed_activities\": [\"BANKING\"], \"business_plan_summary\": \"Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. Banking Service. \", \"projected_annual_revenue\": 13000}',1,'2026-02-20 19:19:13','2026-02-20 19:18:33','2026-02-20 19:19:12'),(73,44,4,'{\"director_names\": \"Hello\", \"beneficial_owners\": \"Hello -100%\", \"has_criminal_record\": \"no\", \"number_of_directors\": 1}',1,'2026-02-20 19:19:37','2026-02-20 19:19:17','2026-02-20 19:19:37'),(74,44,5,'{}',1,'2026-02-20 19:20:29','2026-02-20 19:20:29','2026-02-20 19:20:29'),(75,43,1,'{\"company_name\": \"Ola\", \"company_type\": \"BRANCH\", \"registration_number\": \"ABC-4321\", \"date_of_incorporation\": \"2026-02-18\", \"country_of_incorporation\": \"US\"}',1,'2026-02-21 06:15:44','2026-02-21 06:15:06','2026-02-21 06:15:44'),(76,43,2,'{\"contact_email\": \"part@test.com\", \"contact_phone\": \"254712345689\", \"postal_address\": \"PO box 1234\", \"physical_address\": \"Location1. Locol\", \"contact_person_name\": \"part\"}',1,'2026-02-21 06:18:04','2026-02-21 06:16:21','2026-02-21 06:18:04'),(77,43,3,'{\"initial_capital\": 5253632, \"proposed_activities\": [\"INSURANCE\"], \"business_plan_summary\": \"Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. Insurance. \", \"projected_annual_revenue\": 122222222}',1,'2026-02-21 06:19:11','2026-02-21 06:18:09','2026-02-21 06:19:11'),(78,43,4,'{\"director_names\": \"teen\", \"beneficial_owners\": \"teen-100\", \"has_criminal_record\": \"no\", \"number_of_directors\": 1}',1,'2026-02-21 06:20:00','2026-02-21 06:19:18','2026-02-21 06:20:00'),(79,43,5,'{}',1,'2026-02-21 06:21:16','2026-02-21 06:21:16','2026-02-21 06:21:16');
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_sections`
--

LOCK TABLES `application_sections` WRITE;
/*!40000 ALTER TABLE `application_sections` DISABLE KEYS */;
INSERT INTO `application_sections` VALUES (1,1,'Company Information','Basic information about your company',1,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(2,1,'Contact Details','Primary contact person and company address',2,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(3,1,'Business Activities','Details about proposed financial services activities',3,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(4,1,'Directors & Shareholders','Information about key personnel',4,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(5,1,'Supporting Documents','Required documentation upload',5,1,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(13,5,'Declaration','Please read each statement carefully and confirm your agreement before proceeding.',1,1,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(14,5,'Part 1 ÔÇö General Information','Provide basic information about the applicant company, its incorporation details, and proposed activities.',2,1,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(15,5,'Part 2 ÔÇö Contact Information','Provide contact details for the primary contact person, the most senior executive, and any professional adviser.',3,1,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(16,5,'Part 3 ÔÇö Group Structure, Controllers & Funding','Provide details about the applicant\'s group structure, parent company, ownership, and governance.',4,1,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(17,5,'Part 4 ÔÇö Operations in the NIFC','Describe the applicant\'s operational history, proposed products and services, risk management, compliance, and related matters.',5,1,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(18,5,'Part 5 ÔÇö Business Plan','Summarise the applicant\'s track record, economic contribution, strategic plans, innovation, and environmental impact.',6,1,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(19,5,'Supporting Documents','Upload all required supporting documentation. Accepted formats include PDF, DOC, DOCX, XLS, XLSX, JPG, and PNG (max 10 MB each).',7,1,'2026-02-21 07:12:16','2026-02-21 07:12:16');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_types`
--

LOCK TABLES `application_types` WRITE;
/*!40000 ALTER TABLE `application_types` DISABLE KEYS */;
INSERT INTO `application_types` VALUES (1,'Financial Services License','FSL','Application for obtaining a financial services license in the Nairobi International Finance Center',0,'2026-01-28 20:19:45','2026-02-21 07:06:33'),(2,'Company Registration','CR','Application for registering a new company in NIFCA',0,'2026-01-28 20:19:45','2026-02-21 07:06:33'),(5,'NIFC Firm Certification','NFC','Application for certification as a firm within the Nairobi International Financial Centre. This form covers the Declaration, Core Information (Parts 1ÔÇô5), and Supporting Documents.',1,'2026-02-21 07:12:16','2026-02-21 07:12:16');
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
  `status` enum('draft','pending','submitted','under_review','in_pipeline','approved','rejected','cancelled') DEFAULT 'draft',
  `pipeline_current_stage_id` int DEFAULT NULL,
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
  `pipeline_started_at` timestamp NULL DEFAULT NULL,
  `pipeline_completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_reference` (`reference_number`),
  KEY `reviewed_by` (`reviewed_by`),
  KEY `idx_applications_client_status` (`client_id`,`status`),
  KEY `idx_applications_status` (`status`),
  KEY `fk_application_type` (`application_type_id`),
  KEY `pipeline_current_stage_id` (`pipeline_current_stage_id`),
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `applications_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `applications_ibfk_4` FOREIGN KEY (`pipeline_current_stage_id`) REFERENCES `pipeline_stages` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_application_type` FOREIGN KEY (`application_type_id`) REFERENCES `application_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (3,9,NULL,'APP-2025-00003','Funding Request','Requesting funding for a community project.','pending',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-19 17:23:32','2026-01-31 22:13:43',NULL,NULL,NULL),(4,9,NULL,'APP-2025-00004','Funding Request','Requesting funding for a community project.','pending',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-19 17:24:39','2026-01-31 22:13:43',NULL,NULL,NULL),(5,9,NULL,'APP-2025-00005','Funding Request','Requesting funding for a community project.','pending',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2025-04-19 17:29:37','2026-01-31 22:13:43',NULL,NULL,NULL),(8,11,1,'NIFCA-2026-00008','Test FSL Application','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-29 20:01:26','2026-01-29 20:01:26',NULL,NULL,NULL),(9,7,2,'NIFCA-2026-00009','Test Application 1769707067629','Application for registering a new company in NIFCA','rejected',NULL,'2026-01-29 20:17:47',55,'rejected','assets/pdfs/application_NIFCA-2026-00009_1769707067695.pdf','2026-01-29 20:17:47',1,100,'2026-01-29 20:17:47','2026-01-31 20:02:08',NULL,NULL,NULL),(10,7,2,'NIFCA-2026-00010','Admin Test Application 1769707068035','Application for registering a new company in NIFCA','approved',NULL,'2026-01-29 20:17:48',42,'Application is under review. Additional documents may be requested.','assets/pdfs/application_NIFCA-2026-00010_1769707068065.pdf','2026-01-29 20:17:48',1,100,'2026-01-29 20:17:48','2026-01-29 20:17:48',NULL,NULL,NULL),(11,7,1,'NIFCA-2026-00011','Test Application 1769707107846','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:18:27','2026-01-29 20:18:27',NULL,NULL,NULL),(12,7,1,'NIFCA-2026-00012','Admin Test Application 1769707108202','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:18:28','2026-01-29 20:18:28',NULL,NULL,NULL),(13,7,1,'NIFCA-2026-00013','Test Application 1769707165404','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:19:25','2026-01-29 20:19:25',NULL,NULL,NULL),(14,7,1,'NIFCA-2026-00014','Admin Test Application 1769707165728','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,NULL,NULL,NULL,NULL,NULL,4,0,'2026-01-29 20:19:25','2026-01-29 20:19:25',NULL,NULL,NULL),(15,7,1,'NIFCA-2026-00015','Test Application 1769707204684','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,4,80,'2026-01-29 20:20:04','2026-01-29 20:20:04',NULL,NULL,NULL),(16,7,1,'NIFCA-2026-00016','Admin Test Application 1769707205200','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,NULL,NULL,NULL,NULL,NULL,4,80,'2026-01-29 20:20:05','2026-01-29 20:20:05',NULL,NULL,NULL),(17,13,2,'NIFCA-2026-00017','Company Registration','Application for registering a new company in NIFCA','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-30 19:52:32','2026-01-30 19:52:32',NULL,NULL,NULL),(18,13,1,'NIFCA-2026-00018','Test FSL Application','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,'2026-01-30 20:06:33',55,'okay','assets/pdfs/application_NIFCA-2026-00018_1769792792979.pdf','2026-01-30 20:06:33',5,100,'2026-01-30 19:55:54','2026-01-31 22:53:29',NULL,NULL,NULL),(19,13,1,'NIFCA-2026-00019','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-30 20:11:55','2026-01-30 20:11:55',NULL,NULL,NULL),(20,13,1,'NIFCA-2026-00020','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,5,40,'2026-01-30 20:12:22','2026-01-30 20:20:00',NULL,NULL,NULL),(21,13,1,'NIFCA-2026-00021','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,5,80,'2026-01-30 20:23:19','2026-01-30 20:30:02',NULL,NULL,NULL),(22,13,1,'NIFCA-2026-00022','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 19:15:11','2026-01-31 19:15:11',NULL,NULL,NULL),(23,13,1,'NIFCA-2026-00023','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,'2026-01-31 19:30:17',55,'Approved','assets/pdfs/application_NIFCA-2026-00023_1769877017430.pdf','2026-01-31 19:30:17',5,100,'2026-01-31 19:16:09','2026-01-31 19:40:23',NULL,NULL,NULL),(24,13,1,'NIFCA-2026-00024','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,20,'2026-01-31 20:11:45','2026-01-31 20:25:51',NULL,NULL,NULL),(25,13,1,'NIFCA-2026-00025','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 20:26:10','2026-01-31 20:26:10',NULL,NULL,NULL),(26,13,1,'NIFCA-2026-00026','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 20:57:04','2026-01-31 20:57:04',NULL,NULL,NULL),(27,13,1,'NIFCA-2026-00027','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,5,80,'2026-01-31 21:17:04','2026-01-31 21:21:11',NULL,NULL,NULL),(28,13,2,'NIFCA-2026-00028','Company Registration','Application for registering a new company in NIFCA','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 21:41:53','2026-01-31 21:41:53',NULL,NULL,NULL),(29,13,1,'NIFCA-2026-00029','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 21:42:56','2026-01-31 21:42:56',NULL,NULL,NULL),(30,13,1,'NIFCA-2026-00030','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','rejected',NULL,'2026-01-31 21:52:09',55,'no','assets/pdfs/application_NIFCA-2026-00030_1769885529464.pdf','2026-01-31 21:52:09',5,100,'2026-01-31 21:43:41','2026-01-31 22:22:34',NULL,NULL,NULL),(31,13,1,'NIFCA-2026-00031','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 22:43:57','2026-01-31 22:43:57',NULL,NULL,NULL),(32,13,1,'NIFCA-2026-00032','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 22:45:40','2026-01-31 22:45:40',NULL,NULL,NULL),(33,13,1,'NIFCA-2026-00033','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-01-31 22:46:28','2026-01-31 22:46:28',NULL,NULL,NULL),(34,13,1,'NIFCA-2026-00034','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-01 09:45:21','2026-02-01 09:45:21',NULL,NULL,NULL),(35,13,1,'NIFCA-2026-00035','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,'2026-02-01 14:23:36',55,'All good. Welcome to Kenya','assets/pdfs/application_NIFCA-2026-00035_1769945016349.pdf','2026-02-01 14:23:36',5,100,'2026-02-01 09:47:52','2026-02-01 14:25:27',NULL,NULL,NULL),(36,13,1,'NIFCA-2026-00036','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-01 12:20:59','2026-02-01 12:20:59',NULL,NULL,NULL),(37,13,1,'NIFCA-2026-00037','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-01 12:48:14','2026-02-01 12:48:14',NULL,NULL,NULL),(38,13,1,'NIFCA-2026-00038','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,20,'2026-02-01 12:51:17','2026-02-01 13:08:02',NULL,NULL,NULL),(39,13,1,'NIFCA-2026-00039','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,2,20,'2026-02-03 07:21:46','2026-02-03 07:22:28',NULL,NULL,NULL),(40,13,1,'NIFCA-2026-00040','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','approved',NULL,'2026-02-03 21:11:14',55,'Mbele pamoja','assets/pdfs/application_NIFCA-2026-00040_1770142302966.pdf','2026-02-03 21:11:43',5,100,'2026-02-03 21:01:54','2026-02-03 21:11:43',NULL,NULL,NULL),(41,18,1,'NIFCA-2026-00041','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-11 18:35:08','2026-02-11 18:35:08',NULL,NULL,NULL),(42,18,1,'NIFCA-2026-00042','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-19 17:25:46','2026-02-19 17:25:46',NULL,NULL,NULL),(43,18,1,'NIFCA-2026-00043','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','submitted',NULL,'2026-02-21 06:21:18',NULL,NULL,'assets/pdfs/application_NIFCA-2026-00043_1771644078431.pdf','2026-02-21 06:21:18',5,100,'2026-02-19 17:27:21','2026-02-21 06:21:18',NULL,NULL,NULL),(44,18,1,'NIFCA-2026-00044','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','in_pipeline',1,'2026-02-20 19:20:30',NULL,NULL,'assets/pdfs/application_NIFCA-2026-00044_1771604430582.pdf','2026-02-20 19:20:30',5,100,'2026-02-20 19:15:26','2026-02-20 19:21:39',NULL,'2026-02-20 16:21:39',NULL),(45,18,1,'NIFCA-2026-00045','Financial Services License','Application for obtaining a financial services license in the Nairobi International Finance Center','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-21 07:03:57','2026-02-21 07:03:57',NULL,NULL,NULL),(46,18,5,'NIFCA-2026-00046','NIFC Firm Certification','Application for certification as a firm within the Nairobi International Financial Centre. This form covers the Declaration, Core Information (Parts 1ÔÇô5), and Supporting Documents.','draft',NULL,NULL,NULL,NULL,NULL,NULL,1,0,'2026-02-21 07:15:59','2026-02-21 07:15:59',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (7,'testclient4','client@nifca.com','$2a$10$y5RLwnGpgPB0/ps6KubtJec58zbLaSTLCJzi7xkOtXqVvko.l4yty',1,NULL,'2026-01-29 17:17:41','active',1,0,'2026-01-30 15:56:34','2025-03-27 13:52:35','2026-01-30 15:56:34',NULL,NULL),(8,'client1','client2@nifca.com','$2a$10$2uvUZ3f64UimwZN69Wnv4u4yn9TaatjlGSZvv16GcyLMoedN4d1NK',1,NULL,'2025-03-29 10:55:49','active',1,0,'2025-03-29 10:57:52','2025-03-29 10:55:30','2025-04-19 10:52:29',NULL,NULL),(9,'testclient','allenpane39@gmail.com','$2a$10$O7869hPHMlMTrPiA44V5oOsy9ocaIGlYgbDPRlUUoYa1y4.Ct3AaK',1,NULL,'2025-04-19 10:54:56','active',1,0,'2025-04-19 14:24:34','2025-04-19 10:54:09','2026-01-30 17:25:35',NULL,NULL),(10,'testclient2','testclient2@nifca.com','$2a$10$Zmvv59iAO1oj/XUwgysDEOgio.6Qwy0SNwOpJ7N0Fh5nY8cIVn7WG',1,NULL,'2026-01-28 17:45:34','active',1,0,'2026-01-28 17:47:01','2026-01-28 17:45:34','2026-01-28 17:47:01',NULL,NULL),(11,'testclient1','testclient1@example.com','$2a$10$yTnPvqK7q0dnXpOXlvxcC.v7caQIguxzwvhWp1LCyenbrFyLLJmXK',1,NULL,'2026-01-29 16:59:28','active',1,0,'2026-01-29 17:01:13','2026-01-29 16:57:29','2026-01-29 17:01:13',NULL,NULL),(12,'testuser123','testuser123@example.com','$2a$10$4mc5bZZBlOeZaWRiTLno9.R..WeYxmOG7Uw3XTEkGl/Lvf1wmLkIC',1,'45f5e7d881d3d72d505723313a96237ebdec835abe98369142244405706a0dcf',NULL,'inactive',0,0,NULL,'2026-01-30 16:47:53','2026-01-30 16:47:53',NULL,NULL),(13,'nifcauser2026','nifcauser2026@example.com','$2a$10$6aTOEgi2Z.T99OTwW2lWAeob/EIRm9j4.FC9JBmfxEr1e8T2XMChm',1,NULL,'2026-02-04 20:23:15','active',1,0,'2026-02-04 20:24:45','2026-01-30 16:49:17','2026-02-04 20:24:45',NULL,NULL),(14,'ukulima','lopow46930@okexbit.com','$2a$10$0Qz/Xd2rxRv2j/4lYpnbWObQ4rCVeppQ0ieBTNTtbQHrH.U7t6.Ai',1,NULL,'2026-02-01 19:01:41','inactive',0,0,NULL,'2026-02-01 18:57:54','2026-02-01 19:01:41',NULL,NULL),(15,'ukulima2','jesanif900@sepole.com','$2a$10$alV6OTOOAROkNTN0iroLsO6H/R3Z3p0xJdMPXcX19R0xxIwJsnGNW',1,NULL,'2026-02-01 19:04:32','active',1,0,'2026-02-01 19:09:20','2026-02-01 19:03:58','2026-02-01 19:09:20',NULL,NULL),(16,'james','linagic860@okexbit.com','$2a$10$pNSoL7e7mOftEuJeYJj5Y.nqrF8pVkLS1JJ9S9t1CxehE9J5gD/se',1,NULL,'2026-02-02 03:58:02','active',1,0,NULL,'2026-02-02 03:57:40','2026-02-02 03:58:21',NULL,NULL),(17,'cipher','cipherjohn254@gmail.com','$2a$10$N5PR4M2/BeznHI7WopyoPOy/Q4zlgg4umWCfJeEDSjaSOvCY/GFDK',1,'b94824b7c837ca51cc0a4a75bd9bf7222c3b7f50995635d86e0ada9be9d7cbf7',NULL,'inactive',0,0,NULL,'2026-02-03 17:59:04','2026-02-03 17:59:04',NULL,NULL),(18,'nifcauser2027','nifcauser2027@example.com','$2a$10$BT/7tPu8vxjk3YSEx8DKkeDih11zzoNCHpnafA/wqVbBBJYFTA4.S',1,NULL,'2026-02-04 20:25:25','active',1,0,'2026-02-21 03:14:07','2026-02-04 20:25:25','2026-02-21 03:14:07',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'Annual Gala','Join us for our annual gala event.','NIFCA Headquarters',38,'2025-03-29 11:03:08','2025-10-13 01:10:43','/assets/events/nifca_event_ufpid_1760307043532.png','2025-10-13 01:09:00','2025-11-11 01:10:00',0,0,NULL,NULL,NULL,NULL,NULL),(4,'Board Meeting','Test','Nairobi, Kenya',55,'2025-10-13 01:07:44','2025-10-13 01:07:44','/assets/events/nifca_event_414sn_1760306864704.png','2025-10-14 01:07:00','2025-10-15 01:07:00',0,0,NULL,NULL,NULL,NULL,NULL),(5,'Presentation','Today\'s presentation','UpperHill',55,'2025-10-13 11:36:07','2025-10-13 11:37:07','/assets/news/nifca_news_gwhyp_5.png','2025-10-16 11:36:00','2025-10-22 11:36:00',0,0,NULL,NULL,NULL,NULL,NULL),(6,'Meeting with Cipher','A formal meeting was held with Cipher to discuss the application requirements, regulatory expectations, and system readiness. The session covered clarification of submission steps, data validation logic, and compliance considerations for the licensing process. Key action items and next steps were agreed to ensure accurate completion of the application and timely progression to the next review stage.','Team, Virtual',55,'2026-02-03 21:15:58','2026-02-03 21:15:58','/assets/events/nifca_event_xbll4_1770142558086.png','2026-02-03 11:15:00','2026-02-03 13:15:00',0,0,NULL,NULL,NULL,NULL,NULL),(7,'Tech Expo 2026','Tech Expo 2026.','KICC',55,'2026-02-04 21:10:36','2026-02-04 21:10:36','/assets/events/nifca_event_e31zc_1770228636155.png','2026-02-25 21:09:00','2026-02-04 23:09:00',0,0,NULL,NULL,NULL,NULL,NULL),(8,'Test Content Admin','Test Content Admin','Test Content Admin',60,'2026-02-04 23:22:29','2026-02-04 23:22:29',NULL,'2026-02-04 23:22:00','2026-02-04 12:22:00',0,0,NULL,NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (5,'New Test Article','This is the content of the new test article.',55,'2025-09-29 22:20:51','2025-09-29 22:20:51',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(8,'New Test Article 2','This is the content of the new test article.',55,'2025-09-29 22:29:26','2025-09-29 22:29:26','/assets/1759174165421pexels-photo-31325371.jpeg',0,0,NULL,NULL,NULL,NULL,NULL),(9,'Updated Test Article 3','This is the updated content of the new test article.',55,'2025-09-29 22:31:21','2025-09-29 22:41:27','/assets/1759174887759pexels-photo-16803438.jpeg',0,0,NULL,NULL,NULL,NULL,NULL),(10,'Updated Article Title 4','This is the updated content of the article.',55,'2025-09-29 22:48:58','2025-10-13 00:41:48','/assets/news/nifca_news_z64ya_1760305308347.png',0,0,NULL,NULL,NULL,NULL,NULL),(12,'test','frontend',55,'2025-10-13 00:15:38','2025-10-13 00:15:38','/assets/news/nifca_news_9elyj_12.jpeg',0,0,NULL,NULL,NULL,NULL,NULL),(13,'frontend','test',55,'2025-10-13 00:29:52','2025-10-13 00:29:52','/assets/news/nifca_news_tr63o_1760304592781.png',0,0,NULL,NULL,NULL,NULL,NULL),(16,'test','test world',55,'2025-10-13 11:40:35','2025-10-13 11:40:35',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(17,'blah ','blah',55,'2025-10-13 11:40:47','2025-10-13 11:40:47',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(18,'nah ah ','hellnah',55,'2025-10-13 11:41:03','2025-10-13 11:41:03',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(19,'ola test','ola',55,'2025-10-13 21:18:45','2025-10-13 21:18:45','/assets/news/nifca_news_b25m5_1760379525133.png',0,0,NULL,NULL,NULL,NULL,NULL),(20,'ola babe','what?',55,'2025-10-13 21:38:05','2025-10-13 21:38:05','/assets/news/nifca_news_4ibah_1760380685088.png',0,0,NULL,NULL,NULL,NULL,NULL),(21,'social_media test','hello post from web',55,'2025-10-13 21:40:44','2025-10-13 21:40:44','/assets/news/nifca_news_12szm_1760380844802.png',0,0,NULL,NULL,NULL,NULL,NULL),(22,'test','hello social media',55,'2025-10-13 21:45:37','2025-10-13 21:45:37','/assets/news/nifca_news_qcoug_1760381137385.png',0,0,NULL,NULL,NULL,NULL,NULL),(23,'NIFCA Launches Financial Innovation Hub','The Nairobi International Finance Centre is proud to announce the launch of a new Financial Innovation Hub aimed at fostering collaboration between fintech startups and traditional institutions.',55,'2025-10-13 21:55:00','2025-10-13 21:55:00','/assets/news/nifca_news_bb7kc_1760381700391.png',0,0,NULL,NULL,NULL,NULL,NULL),(24,'Test 29','Test-29-10-2025',55,'2025-10-29 21:05:54','2025-10-29 21:05:54','/assets/news/nifca_news_s8z5y_1761761154726.png',0,0,NULL,NULL,NULL,NULL,NULL),(25,'Test News: NIFCA Social Media Integration','This is a test article to verify that social media posting works correctly with our Twitter and LinkedIn integration. The NIFCA platform is testing its automated posting capabilities to ensure seamless content distribution across multiple platforms.',55,'2025-10-29 21:12:05','2025-10-29 21:12:06','/assets/news/nifca_news_v8n1e_25',0,0,NULL,NULL,NULL,NULL,NULL),(26,'NIFCA Social Media Test #2','This is our second test of the social media integration. We are verifying that the Twitter posting works correctly after updating app permissions to Read and Write. The system should now be able to post tweets automatically when news articles are created.',55,'2025-10-29 21:33:11','2025-10-29 21:33:12','/assets/news/nifca_news_ry5rj_26',0,0,NULL,NULL,NULL,NULL,NULL),(27,'NIFCA Twitter Integration Test #3','This is our third test with regenerated access tokens. After updating app permissions to Read and Write and regenerating the access tokens, the Twitter integration should now work correctly. The NIFCA platform can automatically post news updates to Twitter!',55,'2025-10-29 21:38:17','2025-10-29 21:38:18','/assets/news/nifca_news_j6dne_27',0,0,NULL,NULL,NULL,NULL,NULL),(28,'Test From Frontend','Test From Frontend',55,'2025-10-29 21:43:10','2025-10-29 21:43:10','/assets/news/nifca_news_d84fs_1761763390772.png',0,0,NULL,NULL,NULL,NULL,NULL),(29,'Test','Test at 28-11-2025',55,'2025-11-28 09:57:25','2025-11-28 09:57:25','/assets/news/nifca_news_wcv8g_1764313045881.png',0,0,NULL,NULL,NULL,NULL,NULL),(30,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa’s economic future.',55,'2025-11-28 10:05:49','2025-11-28 10:05:49','/assets/news/nifca_news_vo104_1764313549778.png',0,0,NULL,NULL,NULL,NULL,NULL),(31,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa',55,'2025-11-28 10:27:45','2025-11-28 10:27:45','/assets/news/nifca_news_vmpin_1764314865796.png',0,0,NULL,NULL,NULL,NULL,NULL),(32,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:29:22','2025-11-28 10:29:22','/assets/news/nifca_news_ue64b_1764314962370.png',0,0,NULL,NULL,NULL,NULL,NULL),(33,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa',55,'2025-11-28 10:31:22','2025-11-28 10:31:22','/assets/news/nifca_news_p26gw_1764315082865.png',0,0,NULL,NULL,NULL,NULL,NULL),(34,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:32:30','2025-11-28 10:32:30','/assets/news/nifca_news_mkq5n_1764315150431.png',0,0,NULL,NULL,NULL,NULL,NULL),(35,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:33:25','2025-11-28 10:33:25',NULL,0,0,NULL,NULL,NULL,NULL,NULL),(36,'Nairobi’s Rise as a Financial Hub','The Nairobi International Financial Centre is positioning Kenya as Africa’s premier financial hub—driving investment, innovation, and global partnerships. A bold step toward strengthening East Africa.',55,'2025-11-28 10:41:36','2025-11-28 10:41:36','/assets/news/nifca_news_i210y_1764315696477.png',0,0,NULL,NULL,NULL,NULL,NULL),(37,'Test','Test',55,'2026-02-03 21:19:56','2026-02-03 21:19:56','/assets/news/nifca_news_vsy2p_1770142796869.png',0,0,NULL,NULL,NULL,NULL,NULL),(38,'Meeting with Cipher','A formal meeting was held with Cipher to discuss the application requirements, regulatory expectations, and system readiness. The session covered clarification of submission steps, data validation logic, and compliance considerations for the licensing process. Key action items and next steps were agreed to ensure accurate completion of the application and timely progression to the next review stage.',55,'2026-02-03 21:21:50','2026-02-03 21:21:50','/assets/news/nifca_news_f0pqe_1770142910064.png',0,0,NULL,NULL,NULL,NULL,NULL),(39,'Tech Expo 2026','Tech Expo 2026',55,'2026-02-04 21:12:45','2026-02-04 21:12:45','/assets/news/nifca_news_ygwp9_1770228764979.png',0,0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pipeline_audit_log`
--

DROP TABLE IF EXISTS `pipeline_audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipeline_audit_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `pipeline_stage_id` int DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `performed_by` int NOT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `application_id` (`application_id`),
  CONSTRAINT `pipeline_audit_log_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pipeline_audit_log`
--

LOCK TABLES `pipeline_audit_log` WRITE;
/*!40000 ALTER TABLE `pipeline_audit_log` DISABLE KEYS */;
INSERT INTO `pipeline_audit_log` VALUES (1,44,1,'pipeline_initialized',55,NULL,'{\"status\": \"in_pipeline\"}','2026-02-20 16:21:39');
/*!40000 ALTER TABLE `pipeline_audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pipeline_stage_definitions`
--

DROP TABLE IF EXISTS `pipeline_stage_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipeline_stage_definitions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `stage_order` int NOT NULL,
  `description` text,
  `requires_unanimous` tinyint(1) DEFAULT '0',
  `min_reviewers` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pipeline_stage_definitions`
--

LOCK TABLES `pipeline_stage_definitions` WRITE;
/*!40000 ALTER TABLE `pipeline_stage_definitions` DISABLE KEYS */;
INSERT INTO `pipeline_stage_definitions` VALUES (1,'Document Approval',1,'Verify all submitted documents are complete and valid',0,1,'2026-02-20 16:13:26'),(2,'Strategic Fit Test',2,'Assess alignment with NIFC strategic objectives',0,1,'2026-02-20 16:13:26'),(3,'Due Diligence',3,'Conduct background and compliance checks',0,1,'2026-02-20 16:13:26'),(4,'Board Approval',4,'Final board decision - requires unanimous approval',1,3,'2026-02-20 16:13:26');
/*!40000 ALTER TABLE `pipeline_stage_definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pipeline_stage_reviewers`
--

DROP TABLE IF EXISTS `pipeline_stage_reviewers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipeline_stage_reviewers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pipeline_stage_id` int NOT NULL,
  `user_id` int NOT NULL,
  `review_order` int NOT NULL,
  `status` enum('pending','active','approved','rejected','returned') DEFAULT 'pending',
  `comments` text,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_stage_reviewer` (`pipeline_stage_id`,`user_id`),
  UNIQUE KEY `unique_stage_order` (`pipeline_stage_id`,`review_order`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `pipeline_stage_reviewers_ibfk_1` FOREIGN KEY (`pipeline_stage_id`) REFERENCES `pipeline_stages` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pipeline_stage_reviewers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pipeline_stage_reviewers`
--

LOCK TABLES `pipeline_stage_reviewers` WRITE;
/*!40000 ALTER TABLE `pipeline_stage_reviewers` DISABLE KEYS */;
/*!40000 ALTER TABLE `pipeline_stage_reviewers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pipeline_stages`
--

DROP TABLE IF EXISTS `pipeline_stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pipeline_stages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `application_id` int NOT NULL,
  `stage_definition_id` int NOT NULL,
  `status` enum('pending','active','approved','rejected','returned') DEFAULT 'pending',
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `comments` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_app_stage` (`application_id`,`stage_definition_id`),
  KEY `stage_definition_id` (`stage_definition_id`),
  CONSTRAINT `pipeline_stages_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pipeline_stages_ibfk_2` FOREIGN KEY (`stage_definition_id`) REFERENCES `pipeline_stage_definitions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pipeline_stages`
--

LOCK TABLES `pipeline_stages` WRITE;
/*!40000 ALTER TABLE `pipeline_stages` DISABLE KEYS */;
INSERT INTO `pipeline_stages` VALUES (1,44,1,'active','2026-02-20 16:21:39',NULL,NULL,'2026-02-20 16:21:39','2026-02-20 16:21:39'),(2,44,2,'pending',NULL,NULL,NULL,'2026-02-20 16:21:39','2026-02-20 16:21:39'),(3,44,3,'pending',NULL,NULL,NULL,'2026-02-20 16:21:39','2026-02-20 16:21:39'),(4,44,4,'pending',NULL,NULL,NULL,'2026-02-20 16:21:39','2026-02-20 16:21:39');
/*!40000 ALTER TABLE `pipeline_stages` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `press_releases`
--

LOCK TABLES `press_releases` WRITE;
/*!40000 ALTER TABLE `press_releases` DISABLE KEYS */;
INSERT INTO `press_releases` VALUES (2,'Hello World ','Hello World ',55,'2025-10-13 11:47:38','2025-10-13 11:47:38',0,0,NULL,NULL,NULL,NULL,NULL),(3,'Hello World ','Hello World ',55,'2025-10-13 11:47:47','2025-10-13 11:47:47',0,0,NULL,NULL,NULL,NULL,NULL),(4,'Hello World ','Hello World ',55,'2025-10-13 11:47:56','2025-10-13 11:47:56',0,0,NULL,NULL,NULL,NULL,NULL),(5,'Hello World ','Hello World ',55,'2025-10-13 11:48:04','2025-10-13 11:48:04',0,0,NULL,NULL,NULL,NULL,NULL),(6,'Hello World ','Hello World ',55,'2025-10-13 11:48:12','2025-10-13 11:48:12',0,0,NULL,NULL,NULL,NULL,NULL),(7,'Hello World ','Hello World ',55,'2025-10-13 11:48:21','2025-10-13 11:48:21',0,0,NULL,NULL,NULL,NULL,NULL),(8,'Hello World ','Hello World ',55,'2025-10-13 11:48:30','2025-10-13 11:48:30',0,0,NULL,NULL,NULL,NULL,NULL),(9,'Hello World ','Hello World ',55,'2025-10-13 11:48:39','2025-10-13 11:48:39',0,0,NULL,NULL,NULL,NULL,NULL),(10,'Simple Press Release','Simple Press Release',55,'2026-02-04 21:15:53','2026-02-04 21:15:53',0,0,NULL,NULL,NULL,NULL,NULL);
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
  `field_label` text NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section_fields`
--

LOCK TABLES `section_fields` WRITE;
/*!40000 ALTER TABLE `section_fields` DISABLE KEYS */;
INSERT INTO `section_fields` VALUES (1,1,'company_name','Company Name','text',NULL,'{\"maxLength\": 200, \"minLength\": 3}',1,1,'Enter your company name','Legal name as registered','2026-01-28 20:19:45','2026-01-28 20:19:45'),(2,1,'registration_number','Company Registration Number','text',NULL,'{\"pattern\": \"^[A-Z0-9-]+$\"}',1,2,'e.g., ABC-123456','Your company registration number from the registrar','2026-01-28 20:19:45','2026-01-28 20:19:45'),(3,1,'date_of_incorporation','Date of Incorporation','date',NULL,NULL,1,3,NULL,'When was the company incorporated?','2026-01-28 20:19:45','2026-01-28 20:19:45'),(4,1,'country_of_incorporation','Country of Incorporation','select','[{\"label\": \"Kenya\", \"value\": \"KE\"}, {\"label\": \"United States\", \"value\": \"US\"}, {\"label\": \"United Kingdom\", \"value\": \"UK\"}, {\"label\": \"Other\", \"value\": \"OTHER\"}]',NULL,1,4,NULL,'Select the country where your company is incorporated','2026-01-28 20:19:45','2026-01-28 20:19:45'),(5,1,'company_type','Type of Company','select','[{\"label\": \"Limited Liability Company\", \"value\": \"LLC\"}, {\"label\": \"Public Limited Company\", \"value\": \"PLC\"}, {\"label\": \"Branch of Foreign Company\", \"value\": \"BRANCH\"}]',NULL,1,5,NULL,NULL,'2026-01-28 20:19:45','2026-01-28 20:19:45'),(11,5,'certificate_of_incorporation','Certificate of Incorporation','file',NULL,'{\"accept\": \".pdf,.jpg,.png\", \"maxSize\": 10485760}',1,1,NULL,'Upload a certified copy (PDF, JPG, or PNG, max 10MB)','2026-01-28 20:29:18','2026-01-28 20:29:18'),(12,5,'memorandum_articles','Memorandum & Articles of Association','file',NULL,'{\"accept\": \".pdf\", \"maxSize\": 10485760}',1,2,NULL,'Upload PDF document','2026-01-28 20:29:18','2026-01-28 20:29:18'),(13,5,'business_plan','Detailed Business Plan','file',NULL,'{\"accept\": \".pdf,.doc,.docx\", \"maxSize\": 10485760}',1,3,NULL,'Upload detailed business plan document','2026-01-28 20:29:18','2026-01-28 20:29:18'),(14,5,'financial_projections','Financial Projections','file',NULL,'{\"accept\": \".pdf,.xls,.xlsx\", \"maxSize\": 10485760}',1,4,NULL,'5-year financial projections','2026-01-28 20:29:18','2026-01-28 20:29:18'),(15,5,'additional_documents','Additional Supporting Documents','file',NULL,'{\"accept\": \".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png\", \"maxSize\": 10485760}',0,5,NULL,'Any other relevant documents (optional)','2026-01-28 20:29:18','2026-01-28 20:29:18'),(16,2,'contact_person_name','Contact Person Name','text',NULL,'{\"maxLength\": 100, \"minLength\": 2}',1,1,'Full name of primary contact',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(17,2,'contact_email','Contact Email','email',NULL,NULL,1,2,'email@company.com',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(18,2,'contact_phone','Contact Phone','text',NULL,'{\"pattern\": \"^[+]?[0-9s-]+$\"}',1,3,'+254 XXX XXX XXX',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(19,2,'physical_address','Physical Address','textarea',NULL,'{\"maxLength\": 500, \"minLength\": 10}',1,4,'Street address, Building, Floor',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(20,2,'postal_address','Postal Address','textarea',NULL,'{\"maxLength\": 300}',0,5,'P.O. Box XXXXX, Nairobi','Optional','2026-01-30 20:18:50','2026-01-30 20:18:50'),(21,3,'proposed_activities','Proposed Financial Activities','checkbox','[{\"label\": \"Banking Services\", \"value\": \"BANKING\"}, {\"label\": \"Insurance Services\", \"value\": \"INSURANCE\"}, {\"label\": \"Securities Trading\", \"value\": \"SECURITIES\"}, {\"label\": \"Fund Management\", \"value\": \"FUND_MGMT\"}, {\"label\": \"Foreign Exchange Services\", \"value\": \"FOREX\"}]',NULL,1,1,NULL,'Select all that apply','2026-01-30 20:18:50','2026-01-30 20:18:50'),(22,3,'business_plan_summary','Business Plan Summary','textarea',NULL,'{\"maxLength\": 2000, \"minLength\": 100}',1,2,'Provide a summary of your business plan...','Describe your proposed business activities, target market, and strategy','2026-01-30 20:18:50','2026-01-30 20:18:50'),(23,3,'projected_annual_revenue','Projected Annual Revenue (USD)','number',NULL,'{\"min\": 0}',1,3,'0','Estimated first year revenue','2026-01-30 20:18:50','2026-01-30 20:18:50'),(24,3,'initial_capital','Initial Capital Investment (USD)','number',NULL,'{\"min\": 0}',1,4,'0','Amount of capital to be invested','2026-01-30 20:18:50','2026-01-30 20:18:50'),(25,4,'number_of_directors','Number of Directors','number',NULL,'{\"max\": 50, \"min\": 1}',1,1,'0',NULL,'2026-01-30 20:18:50','2026-01-30 20:18:50'),(26,4,'director_names','Names of Directors','textarea',NULL,'{\"minLength\": 3}',1,2,'List each director on a new line','Full legal names of all directors','2026-01-30 20:18:50','2026-01-30 20:18:50'),(27,4,'beneficial_owners','Beneficial Owners (>10% ownership)','textarea',NULL,NULL,1,3,'Name - Percentage ownership','List all persons or entities with more than 10% ownership','2026-01-30 20:18:50','2026-01-30 20:18:50'),(28,4,'has_criminal_record','Do any directors have criminal records?','radio','[{\"label\": \"Yes\", \"value\": \"yes\"}, {\"label\": \"No\", \"value\": \"no\"}]',NULL,1,4,NULL,'This will be verified','2026-01-30 20:18:50','2026-01-30 20:18:50'),(36,13,'declaration_authority','I confirm that I have the authority to sign and submit this application on behalf of the applicant.','checkbox','[{\"label\": \"I agree\", \"value\": \"agreed\"}]',NULL,1,1,NULL,NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(37,13,'declaration_accuracy','I declare that, to the best of my knowledge, the information provided in this form is true, complete, and accurate. I understand that providing false or misleading information may result in the application being refused or any certification granted being revoked.','checkbox','[{\"label\": \"I agree\", \"value\": \"agreed\"}]',NULL,1,2,NULL,NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(38,13,'declaration_additional_info','I confirm my understanding that the NIFC Authority may request more detailed information or documentation in support of this application, and I undertake to provide such information promptly.','checkbox','[{\"label\": \"I agree\", \"value\": \"agreed\"}]',NULL,1,3,NULL,NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(39,13,'declaration_data_use','I understand that any data provided to the NIFC Authority in this application will be used for the purposes of assessing this application and for ongoing regulatory and supervisory purposes.','checkbox','[{\"label\": \"I agree\", \"value\": \"agreed\"}]',NULL,1,4,NULL,NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(40,13,'declarant_name','Full Name of Declarant','text',NULL,'{\"maxLength\": 200, \"minLength\": 2}',1,5,'Enter your full name','The name of the person authorised to submit this application.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(41,13,'declarant_position','Position / Title','text',NULL,'{\"maxLength\": 150, \"minLength\": 2}',1,6,'e.g. Chief Executive Officer','Your role or title within the applicant organisation.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(42,13,'declaration_date','Date','date',NULL,NULL,1,7,NULL,'The date on which this declaration is made.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(43,14,'company_name','Company Name','text',NULL,'{\"maxLength\": 300, \"minLength\": 2}',1,1,'e.g. Acme Holdings Ltd (trading as Acme Finance)','Include any trading name in brackets.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(44,14,'date_of_incorporation','Date of Incorporation','date',NULL,NULL,1,2,NULL,'The date on which the company was formally incorporated.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(45,14,'registration_number','Business Registration Number','text',NULL,'{\"maxLength\": 100, \"minLength\": 1}',1,3,'e.g. PVT-2024-08832','The registration or company number issued at incorporation.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(46,14,'country_of_incorporation','Country of Incorporation','select','[{\"label\": \"Kenya\", \"value\": \"Kenya\"}, {\"label\": \"Other (please specify in the address field)\", \"value\": \"Other\"}]',NULL,1,4,NULL,'Select the country in which the company was incorporated.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(47,14,'registered_address','Registered Office Address','textarea',NULL,'{\"maxLength\": 500, \"minLength\": 10}',1,5,'Street address, Building, Floor, City, Country','The full registered address of the applicant company.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(48,14,'telephone_number','Telephone Number','text',NULL,'{\"maxLength\": 30}',1,6,'+254 XXX XXX XXX',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(49,14,'email_address','Email Address','email',NULL,NULL,1,7,'info@company.co.ke',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(50,14,'principal_activities','Principal Activities (Current and Proposed)','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 20}',1,8,'Describe the applicant\'s current and proposed business activities...','Provide a clear description of the applicant\'s current activities and those it proposes to undertake within the NIFC.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(51,14,'proposed_structure','Proposed Structure','select','[{\"label\": \"Branch\", \"value\": \"Branch\"}, {\"label\": \"Subsidiary\", \"value\": \"Subsidiary\"}, {\"label\": \"New Entity\", \"value\": \"New Entity\"}]',NULL,1,9,NULL,'Select the legal structure through which the applicant proposes to operate in the NIFC.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(52,14,'regulatory_licence','Does the applicant require a licence from any regulator in Kenya?','textarea',NULL,'{\"maxLength\": 2000}',1,10,'If yes, provide details including the regulator and licence type...','If so, please provide full details of the regulator, the type of licence, and the current status of the application.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(53,14,'financial_year_period','Financial Year Period','text',NULL,'{\"maxLength\": 100}',1,11,'e.g. 1 January ÔÇô 31 December','State the start and end dates of the applicant\'s financial year.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(54,15,'contact_person_name','Contact Person ÔÇö Full Name','text',NULL,'{\"maxLength\": 200, \"minLength\": 2}',1,1,'Full name of the designated contact person',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(55,15,'contact_person_phone','Contact Person ÔÇö Telephone','text',NULL,'{\"maxLength\": 30}',1,2,'+254 XXX XXX XXX',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(56,15,'contact_person_email','Contact Person ÔÇö Email Address','email',NULL,NULL,1,3,'contact@company.co.ke',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(57,15,'contact_person_address','Contact Person ÔÇö Postal Address','textarea',NULL,'{\"maxLength\": 500}',1,4,'P.O. Box XXXXX-00100, Nairobi',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(58,15,'senior_executive_name','Senior Executive (e.g. CEO) ÔÇö Full Name','text',NULL,'{\"maxLength\": 200, \"minLength\": 2}',1,5,'Full name of the most senior executive',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(59,15,'senior_executive_phone','Senior Executive ÔÇö Telephone','text',NULL,'{\"maxLength\": 30}',1,6,'+254 XXX XXX XXX',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(60,15,'senior_executive_email','Senior Executive ÔÇö Email Address','email',NULL,NULL,1,7,'ceo@company.co.ke',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(61,15,'senior_executive_address','Senior Executive ÔÇö Postal Address','textarea',NULL,'{\"maxLength\": 500}',1,8,'P.O. Box XXXXX-00100, Nairobi',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(62,15,'professional_adviser_name','Professional Adviser ÔÇö Full Name','text',NULL,'{\"maxLength\": 200}',0,9,'Full name of professional adviser (if applicable)','Leave blank if not applicable.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(63,15,'professional_adviser_phone','Professional Adviser ÔÇö Telephone','text',NULL,'{\"maxLength\": 30}',0,10,'+254 XXX XXX XXX',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(64,15,'professional_adviser_email','Professional Adviser ÔÇö Email Address','email',NULL,NULL,0,11,'adviser@firm.co.ke',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(65,15,'professional_adviser_address','Professional Adviser ÔÇö Postal Address','textarea',NULL,'{\"maxLength\": 500}',0,12,'P.O. Box XXXXX-00100, Nairobi',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(66,15,'copy_adviser_correspondence','Copy adviser on future correspondence?','radio','[{\"label\": \"Yes\", \"value\": \"yes\"}, {\"label\": \"No\", \"value\": \"no\"}]',NULL,0,13,NULL,'Select whether future correspondence from the NIFC Authority should also be sent to the professional adviser.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(67,16,'group_membership','Is the applicant a member of a group? If so, provide details of the group structure.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 5}',1,1,'Describe the group structure or state \"Not applicable\"...','Include a description of the overall group and the applicant\'s position within it.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(68,16,'parent_company_regulated','Is the parent or holding company regulated by any Kenyan or overseas regulator?','textarea',NULL,'{\"maxLength\": 2000}',1,2,'Provide details or state \"Not applicable\"...','Include the name of the regulator and the nature of the authorisation.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(69,16,'consolidated_supervision','Is the applicant or any group member subject to consolidated supervision?','textarea',NULL,'{\"maxLength\": 2000}',1,3,'Provide details or state \"Not applicable\"...','State the name of the consolidating supervisor if applicable.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(70,16,'parent_company_details','Parent company details (name, registration number, contact, address, percentage holding, legal designation).','textarea',NULL,'{\"maxLength\": 3000}',1,4,'Provide full details of the parent or holding company...','If there is no parent company, state \"Not applicable\".','2026-02-21 07:12:16','2026-02-21 07:12:16'),(71,16,'parent_listed_exchange','Is the parent company listed on any recognised stock exchange? If so, which one?','textarea',NULL,'{\"maxLength\": 1000}',0,5,'e.g. Nairobi Securities Exchange (NSE)',NULL,'2026-02-21 07:12:16','2026-02-21 07:12:16'),(72,16,'ownership_details','Full ownership details including beneficiaries and percentage shareholding.','textarea',NULL,'{\"maxLength\": 5000, \"minLength\": 10}',1,6,'List each owner with percentage shareholding...','Include all natural persons who are ultimate beneficial owners.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(73,16,'board_of_directors','Details of each member of the board of directors or governing body.','textarea',NULL,'{\"maxLength\": 5000, \"minLength\": 10}',1,7,'Name, nationality, role, date of appointment...','List each director with their full name, nationality, position, and date of appointment.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(74,16,'senior_management','Details of the senior executive management officers.','textarea',NULL,'{\"maxLength\": 5000, \"minLength\": 10}',1,8,'Name, role, qualifications, experience...','Include chief executive, finance director, compliance officer, and other key individuals.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(75,17,'years_operational','How long has the applicant been operational?','text',NULL,'{\"maxLength\": 100}',1,1,'e.g. 5 years','State the number of years the applicant has been in operation.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(76,17,'business_transfer','Is any business being transferred from another entity (e.g. merger or takeover)?','textarea',NULL,'{\"maxLength\": 2000}',1,2,'Provide details or state \"No\"...','If yes, provide full details including the name of the transferring entity.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(77,17,'expected_client_base','Expected client base (retail, professional, market counterparty, etc.).','textarea',NULL,'{\"maxLength\": 2000, \"minLength\": 10}',1,3,'Describe the types of clients the applicant expects to serve...','Indicate the expected proportion of each client category.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(78,17,'products_services','Types of products or services the applicant offers.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 10}',1,4,'List and describe the products or services...','Provide a clear description of each product or service.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(79,17,'third_party_products','Will any products or services be developed or offered by another firm or third party?','textarea',NULL,'{\"maxLength\": 2000}',1,5,'Provide details or state \"No\"...','If yes, identify the third party and describe the arrangement.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(80,17,'risk_management','Does the applicant have a risk management specialist? If so, describe the proposed system.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 10}',1,6,'Describe the risk management framework and key personnel...','Include details of the risk management specialist and the systems or frameworks in place.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(81,17,'internal_auditing','Who will be responsible for internal auditing and how frequently will audits be carried out?','textarea',NULL,'{\"maxLength\": 2000, \"minLength\": 10}',1,7,'Name of internal auditor or audit function, frequency...','Describe the internal audit arrangements and the planned frequency of audits.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(82,17,'indemnity_insurance','Will the applicant have professional indemnity insurance in place?','textarea',NULL,'{\"maxLength\": 2000}',1,8,'Provide details including proposed insurer and coverage level, or state \"No\"...','If yes, provide the name of the insurer, coverage amount, and scope.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(83,17,'cyber_security_plan','Will the applicant have a cyber security plan in place?','textarea',NULL,'{\"maxLength\": 2000}',1,9,'Describe the cyber security plan or state \"No\"...','Include details of key policies, incident response, and data protection measures.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(84,17,'third_party_providers','Does the applicant plan to engage third-party service providers for key functions?','textarea',NULL,'{\"maxLength\": 3000}',1,10,'List each outsourced function and the third-party provider...','If yes, identify each function, the provider, and the governance arrangements.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(85,17,'external_auditor','Details about the applicant\'s external auditor.','textarea',NULL,'{\"maxLength\": 2000, \"minLength\": 5}',1,11,'Name of audit firm, lead partner, address...','Provide the name, address, and relevant contact details of the external auditor.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(86,17,'organisation_size','Targeted size of the organisation (number of employees) and proposed organisational structure.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 5}',1,12,'e.g. 25 employees across 4 departments...','Include the proposed number of employees and a summary of the organisational structure.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(87,17,'client_money','Will the applicant hold any client money or client investments?','textarea',NULL,'{\"maxLength\": 2000}',1,13,'Provide details or state \"No\"...','If yes, describe the safeguarding arrangements.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(88,17,'retail_complaints','Will the applicant have retail customers? If so, describe arrangements for handling complaints.','textarea',NULL,'{\"maxLength\": 2000}',0,14,'Describe the complaints handling procedure or state \"Not applicable\"...','Include details of the complaints handling procedure and any relevant ombudsman membership.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(89,17,'record_keeping','Arrangements for record keeping and data protection.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 10}',1,15,'Describe the record-keeping and data-protection policies...','Describe how records will be maintained and how personal data will be protected.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(90,17,'pending_investigations','Has the applicant or any board member been subject to any current or pending investigation?','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 2}',1,16,'Provide details or state \"No\"...','Disclose any current or pending investigation, prosecution, or enforcement action.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(91,17,'past_disciplinary','Has the applicant or group been censured, disciplined, or investigated in the last 10 years?','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 2}',1,17,'Provide details or state \"No\"...','Include all censures, disciplinary actions, or adverse findings in the last 10 years.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(92,17,'aml_policies','Details of anti-money laundering policies and related procedures in place.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 10}',1,18,'Describe AML/CFT policies, procedures, and controls...','Summarise the applicant\'s AML/CFT framework including customer due diligence and suspicious activity reporting.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(93,18,'performance_track_record','Performance and track record for the previous three years (where applicable).','textarea',NULL,'{\"maxLength\": 5000, \"minLength\": 10}',1,1,'Summarise key financial and operational performance indicators...','Where available, include revenue, assets under management, profitability, and any relevant benchmarks.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(94,18,'economic_contribution','Likely contribution of the applicant to the economy.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 10}',1,2,'Describe the expected economic impact...','Include expected job creation, tax contribution, capital investment, and knowledge transfer.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(95,18,'business_plan_kenya','Overall plan for the business in Kenya or regionally.','textarea',NULL,'{\"maxLength\": 5000, \"minLength\": 10}',1,3,'Outline the strategic plan for operations in Kenya and the region...','Describe the applicant\'s short-, medium-, and long-term objectives for its operations in Kenya and the wider region.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(96,18,'innovation_expertise','Level of innovation, specialism or expertise of the business.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 10}',1,4,'Describe areas of innovation, specialism, or competitive advantage...','Highlight any innovative products, proprietary technology, or niche expertise.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(97,18,'environmental_social_impact','Environmental and social impact of the business.','textarea',NULL,'{\"maxLength\": 3000, \"minLength\": 10}',1,5,'Describe the environmental and social impact or commitments...','Include any ESG policies, sustainability commitments, or social impact initiatives.','2026-02-21 07:12:16','2026-02-21 07:12:16'),(98,19,'business_plan_doc','Business Plan','file',NULL,'{\"accept\": \".pdf,.doc,.docx\", \"maxSize\": 10485760}',1,1,NULL,'Upload a comprehensive business plan document (PDF, DOC, or DOCX ÔÇö max 10 MB).','2026-02-21 07:12:16','2026-02-21 07:12:16'),(99,19,'certificate_of_incorporation','Certificate of Incorporation','file',NULL,'{\"accept\": \".pdf,.jpg,.png\", \"maxSize\": 10485760}',1,2,NULL,'Upload a certified copy of the certificate of incorporation (PDF, JPG, or PNG ÔÇö max 10 MB).','2026-02-21 07:12:16','2026-02-21 07:12:16'),(100,19,'group_structure_doc','Group Structure Documentation','file',NULL,'{\"accept\": \".pdf,.doc,.docx,.jpg,.png\", \"maxSize\": 10485760}',0,3,NULL,'Upload a diagram or document illustrating the group structure (optional).','2026-02-21 07:12:16','2026-02-21 07:12:16'),(101,19,'board_executive_resumes','Resumes of Board / Executive Members','file',NULL,'{\"accept\": \".pdf,.doc,.docx\", \"maxSize\": 10485760}',1,4,NULL,'Upload CVs or resumes of all board members and senior executives (PDF or DOC ÔÇö max 10 MB).','2026-02-21 07:12:16','2026-02-21 07:12:16'),(102,19,'audited_accounts','Latest Audited Accounts','file',NULL,'{\"accept\": \".pdf,.xls,.xlsx\", \"maxSize\": 10485760}',1,5,NULL,'Upload the most recent audited financial statements (PDF or Excel ÔÇö max 10 MB).','2026-02-21 07:12:16','2026-02-21 07:12:16'),(103,19,'additional_documents','Additional Supporting Documents','file',NULL,'{\"accept\": \".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png\", \"maxSize\": 10485760}',0,6,NULL,'Upload any other relevant supporting documents (optional).','2026-02-21 07:12:16','2026-02-21 07:12:16');
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
INSERT INTO `sessions` VALUES ('t1TMLdYUt4Im8AKDQ9QSqchLr5VuPEbH',1771734252,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-02-22T03:14:07.577Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"userId\":18,\"role\":7,\"companyId\":1,\"isClient\":true}}');
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_audit_log`
--

LOCK TABLES `user_audit_log` WRITE;
/*!40000 ALTER TABLE `user_audit_log` DISABLE KEYS */;
INSERT INTO `user_audit_log` VALUES (1,39,'create',33,NULL,'{\"email\": \"contentadmin2@nifca.com\", \"role_id\": 2, \"username\": \"contentadmin2\", \"company_id\": 1}','2025-03-29 12:57:25'),(2,39,'disable',33,'{\"enabled\": 1}','{\"enabled\": false}','2025-03-29 13:02:45'),(3,39,'enable',33,'{\"enabled\": 0}','{\"enabled\": true}','2025-03-29 13:05:38'),(4,39,'reset_password',33,NULL,NULL,'2025-03-29 13:08:10'),(5,40,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 3, \"username\": \"appadmin\", \"company_id\": 1}','2025-03-29 13:49:33'),(6,40,'verify_email',40,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-03-29 13:50:09'),(7,40,'reset_password',40,NULL,NULL,'2025-03-29 14:01:26'),(8,42,'create',33,NULL,'{\"email\": \"appadmin@nifca.com\", \"role_id\": 3, \"username\": \"appadmin\", \"company_id\": 1}','2025-04-19 13:40:12'),(9,43,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane\", \"company_id\": 1}','2025-04-22 21:24:55'),(10,43,'verify_email',43,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 21:33:34'),(11,45,'create',33,NULL,'{\"email\": \"allenpane@gmail.com\", \"role_id\": 2, \"username\": \"allenpane@gmail.com\", \"company_id\": 1}','2025-04-22 21:38:46'),(12,47,'create',33,NULL,'{\"email\": \"allenpane@gmail.com\", \"role_id\": 2, \"username\": \"allenpane@gmail.com\", \"company_id\": 1}','2025-04-22 21:52:09'),(13,48,'create',33,NULL,'{\"email\": \"allenpane@gmail.com\", \"role_id\": 2, \"username\": \"allenpane@gmail.com\", \"company_id\": 1}','2025-04-22 21:54:41'),(14,49,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane399@gmail.com\", \"company_id\": 1}','2025-04-22 21:58:57'),(15,50,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane399@gmail.com\", \"company_id\": 1}','2025-04-22 22:10:15'),(16,51,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"allenpane399@gmail.com\", \"company_id\": 1}','2025-04-22 22:31:50'),(17,51,'verify_email',51,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 22:35:29'),(18,52,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 2, \"username\": \"osuka-admin\", \"company_id\": 1}','2025-04-22 22:40:39'),(19,52,'verify_email',52,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 22:44:46'),(20,53,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 3, \"username\": \"osuka-admin\", \"company_id\": 1}','2025-04-22 22:54:07'),(21,54,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 2, \"username\": \"osuka-admin\", \"company_id\": 1}','2025-04-22 23:04:35'),(22,55,'create',33,NULL,'{\"email\": \"osukasavin2001@gmail.com\", \"role_id\": 2, \"username\": \"osuka\", \"company_id\": 1}','2025-04-22 23:06:29'),(23,55,'verify_email',55,'{\"status\": \"inactive\"}','{\"status\": \"active\"}','2025-04-22 23:06:49'),(24,55,'reset_password',55,NULL,NULL,'2025-04-22 23:48:13'),(25,51,'reset_password',51,NULL,NULL,'2025-04-22 23:50:41'),(26,55,'reset_password',55,NULL,NULL,'2025-04-22 23:55:37'),(27,55,'reset_password',55,NULL,NULL,'2025-04-22 23:58:53'),(28,55,'reset_password',55,NULL,NULL,'2025-04-23 00:05:18'),(29,55,'reset_password',55,NULL,NULL,'2025-04-23 00:16:48'),(30,56,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 2, \"username\": \"contentuser\", \"company_id\": 1}','2025-09-14 14:29:23'),(31,58,'create',33,NULL,'{\"email\": \"allenpane399@gmail.com\", \"role_id\": 3, \"username\": \"apptest\", \"company_id\": 1}','2026-01-28 19:39:36'),(32,60,'create',33,NULL,'{\"email\": \"contenteditor@nifca.com\", \"role_id\": 2, \"username\": \"contenteditor\", \"company_id\": 1}','2026-02-04 23:14:13');
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
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tokens`
--

LOCK TABLES `user_tokens` WRITE;
/*!40000 ALTER TABLE `user_tokens` DISABLE KEYS */;
INSERT INTO `user_tokens` VALUES (19,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzIzOTA2MiwiZXhwIjoxNzQzMjQyNjYyfQ.k0NGM7o-7tE07wmxWjeqLOD_YJ7dH5NtyIbnhWwBF8k','2025-03-29 09:04:22','2025-03-29 10:04:22'),(20,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0MDY4MCwiZXhwIjoxNzQzMjQ0MjgwfQ.YlmpAjj2CEVeOCy6uEcmNsW03q4rtxyYsm_L1VX86Gk','2025-03-29 09:31:20','2025-03-29 10:31:20'),(21,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0MTc4NCwiZXhwIjoxNzQzMjQ1Mzg0fQ.4X5dNy3krJXC0Qdp0KWWUvytOE838CHKYGN4ntq8ySU','2025-03-29 09:49:44','2025-03-29 10:49:44'),(22,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0MjAxMiwiZXhwIjoxNzQzMjQ1NjEyfQ.6GOvCINZa3Z_Ca6TMW-8zBBlWbuCWS2dzCauNGm7Xds','2025-03-29 09:53:32','2025-03-29 10:53:33'),(25,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0NTExOCwiZXhwIjoxNzQzMjQ4NzE4fQ.1ESWO3yj2eoyxRsm2YQ0i_g4sHCR7FTjSiStgEprPdQ','2025-03-29 10:45:18','2025-03-29 11:45:19'),(27,40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc0MzI0NjEwMiwiZXhwIjoxNzQzMjQ5NzAyfQ.q_ngKV-FC05iRrp1REycRTErv2aF8G0-RIMkO9XtpEk','2025-03-29 11:01:42','2025-03-29 12:01:42'),(28,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NTIxOSwiZXhwIjoxNzQ1MDU4ODE5fQ.qdu_LdT65tw9zHRX1Qf2vr_RJtHlpKa4_OvByekIQ90','2025-04-19 09:33:39','2025-04-19 10:33:39'),(29,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NTU4MCwiZXhwIjoxNzQ1MDU5MTgwfQ.KVU3aVZ3nAJtwpnsrsjG--enjfYYNjYbiNDUz6fCwAc','2025-04-19 09:39:40','2025-04-19 10:39:41'),(30,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NTYzMCwiZXhwIjoxNzQ1MDU5MjMwfQ.i5zLU3GyFiJbxRus8p-MS9JuFPiqAfxeafgU5nqXeh8','2025-04-19 09:40:30','2025-04-19 10:40:31'),(31,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1NzY0NSwiZXhwIjoxNzQ1MDYxMjQ1fQ.43teCfrOABZCpCr6wIr2C1ksZC0_9hTtiKmQmKWpMCA','2025-04-19 10:14:05','2025-04-19 11:14:05'),(32,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1ODU4NiwiZXhwIjoxNzQ1MDYyMTg2fQ.egEqd4FXGPYrEl-MQPzEzC4cruhThr_kgwfcyevbUwE','2025-04-19 10:29:46','2025-04-19 11:29:47'),(33,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTA1OTQzNywiZXhwIjoxNzQ1MDYzMDM3fQ.p9cZBOd18YL-_Xmu9MtI1h5goNrMuo4ZTX45uR9rb6c','2025-04-19 10:43:57','2025-04-19 11:43:57'),(34,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MTExMSwiZXhwIjoxNzQ1MzQ0NzExfQ.RJfCo2aKmoBetqacGoXsCLNGltAuFP8Ufp2dOTt8-yE','2025-04-22 16:58:31','2025-04-22 17:58:32'),(35,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MTQ1NiwiZXhwIjoxNzQ1MzQ1MDU2fQ.zvySzpZ4pjDYXXqazPSh5iMXiISoC3Q-cAe9GJPaSBA','2025-04-22 17:04:16','2025-04-22 18:04:16'),(36,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MjE2MiwiZXhwIjoxNzQ1MzQ1NzYyfQ.mcW6HLCJxl5RJ5TBJXow3oX4PztdrCmk5q8auw-WZo0','2025-04-22 17:16:02','2025-04-22 18:16:03'),(37,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MjI0NSwiZXhwIjoxNzQ1MzQ1ODQ1fQ.I2vAVg9e_ETZGMlmLrk3GI0bQwXWAnwuFPXzUC12cvg','2025-04-22 17:17:25','2025-04-22 18:17:25'),(38,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0MzQ0NywiZXhwIjoxNzQ1MzQ3MDQ3fQ.1EDVrTZ8c4J6gc_hdt5Gk1kk9XdLUuaIyUmBcdGOIcY','2025-04-22 17:37:27','2025-04-22 18:37:27'),(39,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0NDIzNCwiZXhwIjoxNzQ1MzQ3ODM0fQ.25akbVn0A3-NM_NKcDG7tsV-9rGcH8HjZ0Z5HR0Pq8A','2025-04-22 17:50:34','2025-04-22 18:50:35'),(40,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0NDI0MSwiZXhwIjoxNzQ1MzQ3ODQxfQ.8JeRgAnudLbiu4_u9Fylj2_sWmJ2uIr4kW10IKPJG74','2025-04-22 17:50:41','2025-04-22 18:50:42'),(41,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0NTUyMiwiZXhwIjoxNzQ1MzQ5MTIyfQ.G57go5HiB2jzjhHLHIO2n4YZY_2IQsnSor0dXS9vG-Q','2025-04-22 18:12:02','2025-04-22 19:12:03'),(42,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM0Njg3MywiZXhwIjoxNzQ1MzUwNDczfQ.Vs6CjO0uZesFPmTcBCvy5SpgL_oaF_VNsEk4mCrK-rY','2025-04-22 18:34:33','2025-04-22 19:34:33'),(44,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MDc1MywiZXhwIjoxNzQ1MzU0MzUzfQ.lHEPVznnxISNPh6WxUIVIWhm8zt2Fv2ANuFtIiEi_aA','2025-04-22 19:39:13','2025-04-22 20:39:13'),(45,52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUyLCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MTExNiwiZXhwIjoxNzQ1MzU0NzE2fQ.WzjmcQsxBXtBvrIJTl9n4SrOOYuMOavonJtr6AL43Us','2025-04-22 19:45:16','2025-04-22 20:45:17'),(46,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MTU1NCwiZXhwIjoxNzQ1MzU1MTU0fQ.7bJEyO4KUNnbVWDfeyW9Fcgx1M5r0pNlzlzbFgL-ISI','2025-04-22 19:52:34','2025-04-22 20:52:34'),(47,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MjI0NiwiZXhwIjoxNzQ1MzU1ODQ2fQ.emhI46Qrz_jsSPHk8vatfqeLMkhmUXJbvP3GhxC-Lqo','2025-04-22 20:04:06','2025-04-22 21:04:06'),(56,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1MzUyNSwiZXhwIjoxNzQ1MzU3MTI1fQ.wuNqDTj46mXiT5dwHjGQLnoAzaJpXGobBIbZzoNnz6c','2025-04-22 20:25:25','2025-04-22 21:25:25'),(64,51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUxLCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1NTExMywiZXhwIjoxNzQ1MzU4NzEzfQ.Mo024YFtLbPOrnvPCq0tzPKFE-iBNZuM6PpK5kIuIrs','2025-04-22 20:51:53','2025-04-22 21:51:53'),(71,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc0NTM1NjYzNiwiZXhwIjoxNzQ1MzYwMjM2fQ.xdj02rxwmsX8Bjt35PHn-6nKBr_LqGTDK5ddrysHcnY','2025-04-22 21:17:16','2025-04-22 22:17:16'),(73,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc1Nzg0OTA4MiwiZXhwIjoxNzU3ODUyNjgyfQ.iFLIutDqKuaP61JfehBncAMCdw6KCZ_UwVpYq68JXDo','2025-09-14 11:24:42','2025-09-14 12:24:43'),(75,39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1ODU1NzM1NSwiZXhwIjoxNzU4NTYwOTU1fQ.e0qbT6G6tZIQxEImaj40AVf2yJkJ9A-FOOSzH8o0Fx0','2025-09-22 16:09:15','2025-09-22 17:09:16'),(77,39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1ODU2NzAwMSwiZXhwIjoxNzU4NTcwNjAxfQ.dQzBopFY0hcw6ghcEaMSmh8RD_A6X5yxJddr35mEPzY','2025-09-22 18:50:01','2025-09-22 19:50:01'),(78,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MTcwNiwiZXhwIjoxNzU5MTc1MzA2fQ.-4-05jCfjr4xRfW6gO2fjJRq0ZYkKCdSgqyUf4_cqRs','2025-09-29 18:48:26','2025-09-29 19:48:26'),(79,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MTc5OCwiZXhwIjoxNzU5MTc1Mzk4fQ.njDYBUrO8C6XoMRmCMoCmJqvMD7MpCeZ8hXJCaEqXYU','2025-09-29 18:49:58','2025-09-29 19:49:59'),(80,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MTgxMiwiZXhwIjoxNzU5MTc1NDEyfQ.GFObfsAfUiPloP4B3j76GxEnNfSX1-KVUmhVYxtpwcg','2025-09-29 18:50:12','2025-09-29 19:50:13'),(81,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MzQxNywiZXhwIjoxNzU5MTc3MDE3fQ._MaTadBS2MlZM-K-Yl4TabBSPRQtk5Xe5fI-yZdeM_A','2025-09-29 19:16:57','2025-09-29 20:16:57'),(82,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3MzU1MSwiZXhwIjoxNzU5MTc3MTUxfQ.9dhkhj17dAWg1w96ExNEupSfjDYVBRzMoH_AOVLo6Ss','2025-09-29 19:19:11','2025-09-29 20:19:11'),(83,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3Mzc0MywiZXhwIjoxNzU5MTc3MzQzfQ.6XVOwJK2J7xQNzhjiRQ2DcScBK8LNGTFlO-ZvXNdER4','2025-09-29 19:22:23','2025-09-29 20:22:24'),(84,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NDUxNywiZXhwIjoxNzU5MTc4MTE3fQ.iribUx_q5QVsS3TbCMNooeYRiw0Li93cizFCDBPPXYE','2025-09-29 19:35:17','2025-09-29 20:35:18'),(85,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NTI5OCwiZXhwIjoxNzU5MTc4ODk4fQ.gepTdioGHTjj8sc5f0kcYPAqf2m3mZ7qGGw06LvMy8w','2025-09-29 19:48:18','2025-09-29 20:48:18'),(86,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NTk5NiwiZXhwIjoxNzU5MTc5NTk2fQ.oBpxKya05YcZCKAdnsJRBidwudjBOIlwzJbQeZqjcXA','2025-09-29 19:59:56','2025-09-29 20:59:56'),(87,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc1OTE3NjY5NSwiZXhwIjoxNzU5MTgwMjk1fQ.RzKJKNse6oFwsy9FYqEe2v1h2lqB51LAtzUYCJbgJqE','2025-09-29 20:11:35','2025-09-29 21:11:35'),(88,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDA4NTc4NywiZXhwIjoxNzYwMDg5Mzg3fQ.03Teo-NzqXk0rSUKfeaws220-thmaUl3jB9DkwOB-3Q','2025-10-10 08:43:07','2025-10-10 09:43:07'),(89,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDI5NzY2MCwiZXhwIjoxNzYwMzAxMjYwfQ.obUX27IRc0kv_PW1b3RKe1RCfLaF1ToesiqmjmxmIAM','2025-10-12 19:34:20','2025-10-12 20:34:21'),(90,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMTA0NiwiZXhwIjoxNzYwMzA0NjQ2fQ.juRxhvw1TSypfVUI5hc_Grh0-eHAuRoVNMh9-O3i6ME','2025-10-12 20:30:46','2025-10-12 21:30:47'),(91,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMTg4NywiZXhwIjoxNzYwMzA1NDg3fQ.QaZZOUUpG8vnIiQH6Dy67le_ggL0RI0Iy5Q20H_7lTs','2025-10-12 20:44:47','2025-10-12 21:44:48'),(92,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMjI1MywiZXhwIjoxNzYwMzA1ODUzfQ.GI9HIvOjPbLjrDezMJz7JL_xnHIUk3ShhNGN9n5z-DM','2025-10-12 20:50:53','2025-10-12 21:50:53'),(93,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwMzA3NCwiZXhwIjoxNzYwMzA2Njc0fQ.bV6TbSMDqOkObk0YBv55pGo4R15zYncItZoMdQozwaU','2025-10-12 21:04:34','2025-10-12 22:04:35'),(94,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDMwNDQxMSwiZXhwIjoxNzYwMzA4MDExfQ.rojrUiHTjKuDUjFexHwiMolQEJTRfeejtww8ICz8lIU','2025-10-12 21:26:51','2025-10-12 22:26:52'),(95,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0NDQzOSwiZXhwIjoxNzYwMzQ4MDM5fQ.x24uk-RbfIi1bmIw3_6NeaiUQXwHmMVO9x8c6ZHHgo4','2025-10-13 08:33:59','2025-10-13 09:34:00'),(96,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0NDQ2OSwiZXhwIjoxNzYwMzQ4MDY5fQ.Up_kUYcT2ziDE0zNDGPh1BNlnVk9sYGKMfshu8PUG2I','2025-10-13 08:34:29','2025-10-13 09:34:29'),(97,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0NTM2MSwiZXhwIjoxNzYwMzQ4OTYxfQ.gDDkQZnSw2Ej7qZgff2yiAn6FEHo364Jvb8pallx_FU','2025-10-13 08:49:21','2025-10-13 09:49:22'),(98,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM0ODcxNywiZXhwIjoxNzYwMzUyMzE3fQ.f3RCZftZ6bZXgtS5Xogrh0J7oOiJ9_kL4lb1xB7pwoo','2025-10-13 09:45:17','2025-10-13 10:45:18'),(99,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MDM3OTQ4OCwiZXhwIjoxNzYwMzgzMDg4fQ.Lp1h1SJR8oB-Yv36L6KZXHVwqT9b_FgTJXI2n11CIvY','2025-10-13 18:18:08','2025-10-13 19:18:09'),(100,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2MTExMSwiZXhwIjoxNzYxNzY0NzExfQ.QfTDEz_tL7NS6IpjxmIBxymB4987FGH89z_55Z2NgS8','2025-10-29 18:05:11','2025-10-29 19:05:11'),(101,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2MTUxNCwiZXhwIjoxNzYxNzY1MTE0fQ.RG4ILu-nqXMql9Py0yquF3lzixLPMT8SNfflf29We3k','2025-10-29 18:11:54','2025-10-29 19:11:54'),(102,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2Mjc4MSwiZXhwIjoxNzYxNzY2MzgxfQ.d49jpW-smdbhxGHt7UfRtF5hkrkiM-AOMGO8IRUbA-I','2025-10-29 18:33:01','2025-10-29 19:33:01'),(103,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2MTc2MzA4NiwiZXhwIjoxNzYxNzY2Njg2fQ.GQPnrwpP9nGbEzN3ETqHFXUpyQi8u_UpSAM18QDd4d0','2025-10-29 18:38:06','2025-10-29 19:38:07'),(104,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc2NDMxMjk2OSwiZXhwIjoxNzY0MzE2NTY5fQ.HH33qx5AIK3HOK88OGMbAeA1AhLw5MVK2-LWQbLEIoY','2025-11-28 06:56:09','2025-11-28 07:56:10'),(105,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2NDMxMjk3NywiZXhwIjoxNzY0MzE2NTc3fQ.FqSJ7f5ATZ73ySjsQrvU6-i-EHyTl3v82iVeTbrDZAU','2025-11-28 06:56:17','2025-11-28 07:56:17'),(106,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2NDMxMzM5NCwiZXhwIjoxNzY0MzE2OTk0fQ.dnXFUoJ4iPs_tQia0NA8coOoqB3pwVcyOBGHCcpjCsg','2025-11-28 07:03:14','2025-11-28 08:03:15'),(107,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTI4NDI5MywiZXhwIjoxNzY5Mjg3ODkzfQ.dYJoOUj2xsKFuRsETJ8kbpxL-2HI0jt4Nj7H9XtPpEA','2026-01-24 19:51:34','2026-01-24 20:51:34'),(108,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTYxODMyOSwiZXhwIjoxNzY5NjIxOTI5fQ.lq_GpFhZ00nb6V8sof-QR_ClYNUpBw4sCyHg7bKB3kM','2026-01-28 16:38:49','2026-01-28 17:38:49'),(109,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTYyMTU1NCwiZXhwIjoxNzY5NjI1MTU0fQ.RJfxj14AbCz5yi202U20wwZHtHyZDnbpoo3iDWTV1eI','2026-01-28 17:32:34','2026-01-28 18:32:34'),(110,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTYyMTk1NCwiZXhwIjoxNzY5NjI1NTU0fQ.UM-69gw7bE5IIztameYUuukP-etc3cWVUTj2rUlj4bM','2026-01-28 17:39:14','2026-01-28 18:39:14'),(111,59,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU5LCJyb2xlIjo3LCJjb21wYW55SWQiOm51bGwsImlhdCI6MTc2OTYyMjEwOCwiZXhwIjoxNzY5NjI1NzA4fQ.Zs8z0i0-mxzpTmqOnJqnJqx7l0kYQlEhxwOryRTQpao','2026-01-28 17:41:48','2026-01-28 18:41:48'),(112,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzA2NywiZXhwIjoxNzY5NzEwNjY3fQ.VaSHuwuiX46rT6zI9uNUTJDTBpk3ZZ7k6tG4nAJLhWY','2026-01-29 17:17:47','2026-01-29 18:17:48'),(113,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzEwOCwiZXhwIjoxNzY5NzEwNzA4fQ.eCTwdD4upKiyZr0u3l9I7_qqCfrNbvCPfukg9cCWCnM','2026-01-29 17:18:28','2026-01-29 18:18:28'),(114,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzE2NSwiZXhwIjoxNzY5NzEwNzY1fQ.OwaUeFhpEz6tWwgKrrt-4Lo2GTpm4JBztzUVo21OVtA','2026-01-29 17:19:25','2026-01-29 18:19:26'),(115,42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTcwNzIwNSwiZXhwIjoxNzY5NzEwODA1fQ.nFGygcqhRkWYCRzZd09XlcYzNrYZ_eKtBROtUzxbOPE','2026-01-29 17:20:05','2026-01-29 18:20:05'),(116,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc4ODk1OSwiZXhwIjoxNzY5NzkyNTU5fQ.0v8he4SKMhFZekqWaGKfk6I7wfK--5_IYfmrp7uQ7yk','2026-01-30 16:02:39','2026-01-30 17:02:39'),(117,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc4OTA1MiwiZXhwIjoxNzY5NzkyNjUyfQ.KbjQQ4VkEHWkENNdSZO-n2ODfoKofvpWksU2Fs7xRFU','2026-01-30 16:04:12','2026-01-30 17:04:13'),(118,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc5MDQ5OCwiZXhwIjoxNzY5Nzk0MDk4fQ.aNRujctTYqc5zpqLS5bi7Z6pLN766rDPt2m0O9T5rQ0','2026-01-30 16:28:18','2026-01-30 17:28:19'),(119,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTc5NDMyOCwiZXhwIjoxNzY5Nzk3OTI4fQ.jO_VisdwV809OUJDd6PK11FcQgTujgFJYimHyDMlJms','2026-01-30 17:32:08','2026-01-30 18:32:09'),(120,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg3NzA3NCwiZXhwIjoxNzY5ODgwNjc0fQ.v7UizaaKYAgmqCHUb0LmBQzLeLjfABprJP3GH4ABB7I','2026-01-31 16:31:14','2026-01-31 17:31:15'),(121,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4NzE4MSwiZXhwIjoxNzY5ODkwNzgxfQ.ZINo9hqbtBkFKB6OB2_s4fsHMTG5BdpkfLlF7fYUuvE','2026-01-31 19:19:41','2026-01-31 20:19:41'),(122,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4ODA2MCwiZXhwIjoxNzY5ODkxNjYwfQ.KFxcuPF4hbW9avqG5os2ZGWR6g5y0fKi0P__vS1vSXw','2026-01-31 19:34:20','2026-01-31 20:34:20'),(123,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4ODIzNSwiZXhwIjoxNzY5ODkxODM1fQ.XygQYbA5uK8mcMoZp4HV65el6ZcM_HiMY6mRQhvn1fo','2026-01-31 19:37:15','2026-01-31 20:37:15'),(124,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTg4ODM4MiwiZXhwIjoxNzY5ODkxOTgyfQ.2lfE-WuBRYu3qhbqx1-V-tLwEYAKUygcmrMywO4TvTc','2026-01-31 19:39:42','2026-01-31 20:39:43'),(125,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTkyNzY2MiwiZXhwIjoxNzY5OTMxMjYyfQ.nMlhXOZUj4akP9dxeiKYeXlAm7ifZzUbwA5n_GQnINY','2026-02-01 06:34:22','2026-02-01 07:34:23'),(126,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTkzNzY0MSwiZXhwIjoxNzY5OTQxMjQxfQ.8su_8vXKrvUU4Hrj5noPfCI0UKaxW37SubUHHJFJKVc','2026-02-01 09:20:41','2026-02-01 10:20:41'),(127,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTkzOTMxNywiZXhwIjoxNzY5OTQyOTE3fQ.A-xmfVA2p1MtHkgUjTMP7g5WhGJnKi2-EFXMLLD4Zkw','2026-02-01 09:48:37','2026-02-01 10:48:37'),(128,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTk0MDM0MiwiZXhwIjoxNzY5OTQzOTQyfQ.aAmytHzj4XxWX7GXm52zUBTsN3F3ugHLTt75k35CfUQ','2026-02-01 10:05:42','2026-02-01 11:05:42'),(129,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTk0NTA4NywiZXhwIjoxNzY5OTQ4Njg3fQ.2Vymb_YVZPMxZU5BK1wWHUmKlu9y_1fNEhAXaj_9mSk','2026-02-01 11:24:47','2026-02-01 12:24:48'),(130,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc2OTk3MjE0NSwiZXhwIjoxNzY5OTc1NzQ1fQ.61NQRVk7IRJ84nOojwc9251wLVHaucIjBdT3BDq6l4s','2026-02-01 18:55:45','2026-02-01 19:55:45'),(131,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MDE0MjE3NCwiZXhwIjoxNzcwMTQ1Nzc0fQ.thujM2NI5sCcz0qcoP_71ICL8sVdR9ZczawdymTbqn8','2026-02-03 18:09:34','2026-02-03 19:09:34'),(132,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MDE0MjE5MSwiZXhwIjoxNzcwMTQ1NzkxfQ.tTLtEERXyLbdSjo4lwUoqKmzSAT0fJGe_oNTs_ciEDg','2026-02-03 18:09:51','2026-02-03 19:09:51'),(133,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MDE0MjQxNiwiZXhwIjoxNzcwMTQ2MDE2fQ.KN0ZhDv7zgklTjRM_Cq9mawYV1CKwccSU6r1o58NYEc','2026-02-03 18:13:36','2026-02-03 19:13:37'),(134,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MDIyODU1MSwiZXhwIjoxNzcwMjMyMTUxfQ.zuIQWblgGn3XaQBx8sVlhlmdzQgy_2dzYOLWds34RYo','2026-02-04 18:09:11','2026-02-04 19:09:12'),(135,33,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJyb2xlIjoxLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MDIzNjAyMCwiZXhwIjoxNzcwMjM5NjIwfQ.apswTA8GH2GIMVd28wp5Ukm_YBzGN2PQyDbXM8HG1vc','2026-02-04 20:13:40','2026-02-04 21:13:41'),(136,60,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYwLCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MDIzNjE2NSwiZXhwIjoxNzcwMjM5NzY1fQ.-ioSHWyZeiizpn_iCiIzIyuuoVLAcUwSGJafoja0Y64','2026-02-04 20:16:05','2026-02-04 21:16:06'),(137,60,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYwLCJyb2xlIjoyLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MDIzNjQwMiwiZXhwIjoxNzcwMjQwMDAyfQ.JzYfqJ2J1eSUBOcxOQNhGr8yNq5j2alXVygg-mtiRC4','2026-02-04 20:20:02','2026-02-04 21:20:02'),(138,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MTYwNDQ3MywiZXhwIjoxNzcxNjA4MDczfQ.IBMxND57KjSDfO008YCX3zb7NoF-xj1A6VaJpcIfEDw','2026-02-20 16:21:13','2026-02-20 17:21:14'),(139,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MTYyMDgxOCwiZXhwIjoxNzcxNjI0NDE4fQ.G482u7amfaGA20MrEla4Qwq8XY0prQfYJmt8RoGxaFg','2026-02-20 20:53:38','2026-02-20 21:53:38'),(140,55,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJyb2xlIjozLCJjb21wYW55SWQiOjEsImlhdCI6MTc3MTY0MzU5MSwiZXhwIjoxNzcxNjQ3MTkxfQ.nHVcNQoxCA1g2W6ttZ7KlukTNODUXHz9qHAxOZLQDK4','2026-02-21 03:13:11','2026-02-21 04:13:12');
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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'test15','tes15@xyz.c','$2a$10$b0BgbLGghLLJ8BjgWFEHdeISMEGy.sepbIUKcX20ytYyJl8FV739q',1,1,'active',0,NULL,NULL,'2025-02-12 15:54:43','2025-02-12 15:54:09','2025-04-22 19:39:50',1,NULL,NULL),(31,'testuser5','osukacollins76@gmail.com','$2a$10$19K9hkK6zjlWvMne6bvpu..r1VmhrHXZlIYFxwGI.Bz8/5bAcanVm',1,1,'active',0,'2025-03-27 06:31:36',NULL,'2025-03-27 06:26:49','2025-03-27 06:26:20','2025-03-27 06:37:39',1,NULL,NULL),(33,'siteadmin','siteadmin@nifca.com','$2a$10$oxBrDVhouyIVgjKnWZHIvuWgxyAr9gQgP//vLjGtFDWHl6Cj2UZZ6',1,1,'active',0,'2026-02-04 20:13:40',NULL,'2025-03-27 13:27:44','2025-03-27 13:27:44','2026-02-04 20:13:40',1,NULL,NULL),(36,'tempadmin','tempadmin@nifca.com','$2a$10$yHJi64R1Sck6C4Ju3IiugOc6EivheiwD9U30sMGPvIJo7hCD1rZce',2,0,'inactive',0,NULL,'836739127c20c2b9659c39ad2d2d0f6a06af5f8e23644aefe62165c8d35bfc21',NULL,'2025-03-28 08:25:20','2025-03-28 08:25:20',1,33,NULL),(38,'contentadmin','contentadmin@nifca.com','$2a$10$2Io5SImG/k1WX/8ioEXN.eeRwILdBQ6zNa9Gtv45iZ2X7TMds.n9.',2,0,'active',1,'2025-03-29 08:59:34',NULL,'2025-03-29 07:41:22','2025-03-29 07:40:51','2025-09-14 11:23:20',1,33,NULL),(39,'contentadmin2','contentadmin2@nifca.com','$2a$10$oS6AKKk4HmUPWGReiYQk7eMXq56ztCwzZPJoFuEhyt4.QctvDscPy',2,1,'active',0,'2025-09-22 18:50:01',NULL,'2025-03-29 09:58:55','2025-03-29 09:57:25','2025-09-22 18:50:01',1,33,NULL),(40,'appadmin2','test@xyz.com','$2a$10$FkHMh12P.aiKDrVd6GINbO2SFi7uOr7N.YS7l9PLheFqjwJuM0CrS',3,1,'active',1,'2025-03-29 11:01:42',NULL,'2025-03-29 10:50:09','2025-03-29 10:49:33','2025-04-22 18:23:11',1,33,NULL),(42,'appadmin','appadmin@nifca.com','$2a$10$y5RLwnGpgPB0/ps6KubtJec58zbLaSTLCJzi7xkOtXqVvko.l4yty',3,1,'active',0,'2026-01-29 17:20:05',NULL,'2026-01-29 17:17:41','2025-04-19 10:40:12','2026-01-29 17:20:05',1,33,NULL),(43,'allenpane','test@xyz.co','$2a$10$6UCXSQ0HNqupA8acsSSRLunRb5frVHsFj1gH15MPG8AVfxBfzkak6',2,0,'active',0,NULL,NULL,'2025-04-22 18:33:34','2025-04-22 18:24:54','2025-04-22 18:36:31',1,33,NULL),(45,'test','test@xyz.c','$2a$10$bppdrYJVm1ScnNh648UOIuTvR3pZzrrxLCTjat7D2.xF3UkVDWlGG',2,0,'inactive',0,NULL,'2f3fb752ec49c2df1f296579766de605bd37c70d08e53aa7782175414a780e69',NULL,'2025-04-22 18:38:46','2025-04-22 18:49:29',1,33,NULL),(47,'test47','test47@xyz.c','$2a$10$WlKE/QZiHn8i5t4pB.AeFOO21T7D2mGA59LSnsuewgLb8Uv9Ac3P.',2,0,'inactive',0,NULL,'be8c3121600b8a115d674ff1259529b51ccdc5a10408c8d6646515ace30c1692',NULL,'2025-04-22 18:52:09','2025-04-22 18:54:27',1,33,NULL),(48,'test48','test48@xyz.c','$2a$10$u9DcZG8jOW5s3k1bDzaN2emP1fAoXxUaLzIRgHwlsKxh5/sq0gl7O',2,0,'inactive',0,NULL,'468b9ba68321a0d5ecfe2007f8e243ce6b13a4d4557fbfe760ac11b079afb584',NULL,'2025-04-22 18:54:41','2025-04-22 18:57:27',1,33,NULL),(49,'test49','test49@xyz.c','$2a$10$dUxD0BskpJZH5uZUP7UwWOQvyS.fFGibvPu6Z3QXUJcpJ3yrTF8QG',2,0,'inactive',0,NULL,'6e357a31931010c84e1c3a0a4524847d1d826b95a955ec5ad0caa295c36e6e2c',NULL,'2025-04-22 18:58:57','2025-04-22 19:07:21',1,33,NULL),(50,'test50','tes509@xyz.c','$2a$10$yVKoDkSVX5sGaNf5vH8lk.7V/riMYhKLaXPJVDsCHjoeGtwPeCFVK',2,0,'inactive',0,NULL,'beaadf89d9e4b1c4c29f9bcd126f8888625c12a8f3e5cfe29f2d693997f62b0b',NULL,'2025-04-22 19:10:15','2025-04-22 19:30:59',1,33,NULL),(51,'allenpane399@gmail.com','test@mail.com','$2a$10$GqsNYd4wOB5db9.rzieyEedK7azEBndF/NA3oFMtnSbR5HZgjg9gW',2,1,'active',2,'2025-04-22 20:51:53',NULL,'2025-04-22 19:35:29','2025-04-22 19:31:50','2025-09-14 11:27:49',1,33,NULL),(52,'test15c','tes15@xyz.oc','$2a$10$.ijveiAR9PsTT3GRPxljo.N/pd.RExIJnGVLundrrL5YWZQ5DpL2K',2,0,'active',0,'2025-04-22 19:45:16',NULL,'2025-04-22 19:44:46','2025-04-22 19:40:39','2025-04-22 19:53:11',1,33,NULL),(53,'test15co','tes15@xyz.coc','$2a$10$s2x2wsZWa/465QNRUkDPpOLbagaup8sC/EqMhOSAp4m.gRHcjvTl2',3,0,'inactive',0,NULL,'2386a39e38e3a0057d9743f77d9072871bae902d2d8c34c4107f4abef446b0f2',NULL,'2025-04-22 19:54:07','2025-04-22 20:03:54',1,33,NULL),(54,'test15com','tes15@xyz.cocm','$2a$10$WFpOVomDh1Y2aY7SshRgieDuGczhRTWqCNP547vz5trbhKIhcCMzi',2,1,'inactive',0,NULL,'152cce146036029e91a34c90bb94df279f2a54a4ae371becda3fa23dc49e535f',NULL,'2025-04-22 20:04:35','2025-04-22 20:09:09',1,33,NULL),(55,'osuka','osukasavin2001@gmail.com','$2a$10$nqYKXxfNehzeRcWSNKv0yejcZMyos.ZceH/k5RTP6gpGw9dlMPJnS',3,1,'active',0,'2026-02-21 03:13:11',NULL,'2025-04-22 20:06:49','2025-04-22 20:06:29','2026-02-21 03:13:11',1,33,NULL),(56,'contentuser','contentuser@mail.com','$2a$10$a9mrOrooDh3vkuODd7ZOr.hPbLineUm/7gEZ5/Z4evK9NjDkkq3kC',2,1,'active',0,'2025-09-14 11:44:41',NULL,'2025-09-14 11:41:15','2025-09-14 11:29:23','2025-09-14 11:44:41',1,33,NULL),(58,'apptest','allenpane39@gmail.com','$2a$10$pIm2ky7WCKE8cR8Ug3rhAuG.2rnp.R3PwOAFr.4DOxyHstVmoOxEq',3,0,'inactive',0,NULL,'abb7144322409faea02feaa263a7888312a095b10e5c850d3674426f7cc3b058',NULL,'2026-01-28 16:39:36','2026-01-30 16:34:08',1,33,NULL),(59,'testclient','testclient@nifca.com','$2a$10$XGDgU7700f4MGcw9gjOt.upDYSpLwKAaH.HCvaPZT0Ch3Zts4n/m.',7,1,'active',0,'2026-01-28 17:41:48',NULL,'2026-01-28 17:41:19','2026-01-28 17:41:19','2026-01-28 17:41:48',NULL,NULL,NULL),(60,'contenteditor','contenteditor@nifca.com','$2a$10$97iDt19uU6R2gSUGzNVY1uM4fT6dRf48UZNeEOYWIUOOyDthewsZi',2,1,'active',0,'2026-02-04 20:20:02','4075b7b127ea823afad4eda456eb4caf58a15886b8622e6590adfecc0bf98f22','2026-02-04 20:15:58','2026-02-04 20:14:13','2026-02-04 20:20:02',1,33,NULL);
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

-- Dump completed on 2026-02-21  7:37:21
