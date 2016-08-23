/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 50712
Source Host           : localhost:3306
Source Database       : demo

Target Server Type    : MYSQL
Target Server Version : 50712
File Encoding         : 65001

Date: 2016-08-22 06:55:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `message_list`
-- ----------------------------
DROP TABLE IF EXISTS `message_list`;
CREATE TABLE `message_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NOT NULL,
  `text` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of message_list
-- ----------------------------
INSERT INTO `message_list` VALUES ('1', '1', 'Saving Grace111');
INSERT INTO `message_list` VALUES ('2', '1', 'Saving Grace222');
INSERT INTO `message_list` VALUES ('3', '1', 'Saving Grace333');
INSERT INTO `message_list` VALUES ('5', '2', '宝箱-TREASURE BOX111');
INSERT INTO `message_list` VALUES ('6', '2', '宝箱-TREASURE BOX222');
INSERT INTO `message_list` VALUES ('7', '2', '宝箱-TREASURE BOX333');
INSERT INTO `message_list` VALUES ('8', '3', '春夏秋冬111');
INSERT INTO `message_list` VALUES ('9', '3', '春夏秋冬222');
INSERT INTO `message_list` VALUES ('10', '3', '春夏秋冬333');
INSERT INTO `message_list` VALUES ('11', '4', '晴天111');
INSERT INTO `message_list` VALUES ('12', '4', '晴天222');
INSERT INTO `message_list` VALUES ('13', '4', '晴天333');
INSERT INTO `message_list` VALUES ('14', '5', 'drop pop candy111');
INSERT INTO `message_list` VALUES ('15', '5', 'drop pop candy222');
INSERT INTO `message_list` VALUES ('16', '5', 'drop pop candy333');
INSERT INTO `message_list` VALUES ('17', '6', '届かない恋111');
INSERT INTO `message_list` VALUES ('18', '6', '届かない恋222');
INSERT INTO `message_list` VALUES ('19', '6', '届かない恋333');
INSERT INTO `message_list` VALUES ('20', '7', '一斉の声111');
INSERT INTO `message_list` VALUES ('21', '7', '一斉の声222');
INSERT INTO `message_list` VALUES ('22', '7', '一斉の声333');
INSERT INTO `message_list` VALUES ('23', '8', '相依为命111');
INSERT INTO `message_list` VALUES ('24', '8', '相依为命222');
INSERT INTO `message_list` VALUES ('25', '8', '相依为命333');
INSERT INTO `message_list` VALUES ('26', '9', '不将就111');
INSERT INTO `message_list` VALUES ('27', '9', '不将就222');
INSERT INTO `message_list` VALUES ('28', '9', '不将就333');
INSERT INTO `message_list` VALUES ('29', '10', '演员111');
INSERT INTO `message_list` VALUES ('30', '10', '演员222');
INSERT INTO `message_list` VALUES ('31', '10', '演员333');
