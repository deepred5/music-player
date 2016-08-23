/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 50712
Source Host           : localhost:3306
Source Database       : demo

Target Server Type    : MYSQL
Target Server Version : 50712
File Encoding         : 65001

Date: 2016-08-22 06:51:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `reg`
-- ----------------------------
DROP TABLE IF EXISTS `reg`;
CREATE TABLE `reg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reg
-- ----------------------------
INSERT INTO `reg` VALUES ('2', 'tc2');
INSERT INTO `reg` VALUES ('3', 'tc3');
INSERT INTO `reg` VALUES ('4', 'tc2333');
INSERT INTO `reg` VALUES ('5', 'tccccc');
