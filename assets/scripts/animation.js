/**********************************************************************************************************************
 *
 * WARNING:
 * Copyright Ⓒ 2016 by D.DeRuiter
 * Do not use, modify, or distribute in any way without express written consent.
 *
 * PROJECT:
 * Personal Website
 *
 * DESCRIPTION:
 * JavaScript and JQuery animation for website.
 *
 * AUTHOR:
 * Davis DeRuiter
 *
 * DATE CREATED:
 * 05/30/2016
 *
 **********************************************************************************************************************/

var introMessageCount = 3;
var fadeInTime = 750;
var fadeOutTime = 750;
var textPauseTime = 1000;
var totalAnimTime = fadeInTime + textPauseTime + fadeOutTime;
var debug = false;

$(document).ready(function(){
	"use strict";
	
	if(debug)
	{
		$(".jumbo_intro_content").each(function(index){
    		$(this).delay(index * totalAnimTime).fadeIn(fadeInTime).delay(textPauseTime).fadeOut(fadeOutTime);
		});
		$("#jumbo_permanent_content").delay(totalAnimTime * introMessageCount).fadeIn(fadeInTime);
	}

	// Initialize project picture selectors to first option
	$(".circle_1").each(function(){
		$(this).children().addClass('active');
	});

	var clickDisabledCC = false;
	var clickDisabledQMBES = false;
	var clickDisabledFTP = false;
	var clickDisabledPP = false;
	
	var ccProjectTitles = ["Login Page", "Home Page", "Help Page", "Mission Creator Page", "Mission Loader Page", 
						   "Mission Overview Page - Information Tab", "Mission Overview Page - Communication Tab", 
						   "Mission Overview Page - Communication Tab - Task Form", "Mission Overview Page - Configuration Tab", 
						   "Mission Log Viewer Page", "Mission Logs Page", "Settings Page - Create User Form"];
	var qmbesProjectTitles = ["Home Tab - Before Run", "Home Tab - After Run", "Minterm Tables Tab",
							  "Prime Implicant Charts Tab", "About Tab"];
	var ftpProjectTitles = ["Not Connected", "Connected"];
	var ppProjectTitles = ["Not Connected", "Connected"];
	
	// C&C picture selector animation
	$("#cc_picture_selector .circle_container").each(function() {
		$(this).children().click(function() {
			// Disable selector functionality until image animation completed 
			if(clickDisabledCC) {
				return;
			}
			
			// Remove active class from all circles to reset for new selection 
			$("#cc_picture_selector .circle").each(function() {
				$(this).removeClass('projects active');
			});
			
			// Set current picture selector circle as active
			$(this).children().addClass('projects active');
			
			// Change picture and title
			var pictureNum = parseInt($(this).attr('class').replace("circle_", ""));
			$("#cc_pic").attr('src', "assets/images/projects/cc/cc_" + pictureNum + ".png");
			$("#cc_picture_title").text(ccProjectTitles[pictureNum - 1]);
			
			// Animation
			clickDisabledCC = true;
			$("#cc_picture_title, #cc_pic").hide().fadeIn('fast', function() {
				clickDisabledCC = false;
			});
		});
	});
	
	// QMBES picture selector animation
	$("#qmbes_picture_selector .circle_container").each(function() {
		$(this).children().click(function() {
			// Disable selector functionality until image animation completed 
			if(clickDisabledQMBES) {
				return;
			}
			
			// Remove active class from all circles to reset for new selection 
			$("#qmbes_picture_selector .circle").each(function() {
				$(this).removeClass('projects active');
			});
			
			// Set current picture selector circle as active
			$(this).children().addClass('projects active');
			
			// Change picture and title
			var pictureNum = parseInt($(this).attr('class').replace("circle_", ""));
			$("#qmbes_pic").attr('src', "assets/images/projects/qmbes/qmbes_" + pictureNum + ".png");
			$("#qmbes_picture_title").text(qmbesProjectTitles[pictureNum - 1]);
			
			// Animation
			clickDisabledQMBES = true;
			$("#qmbes_picture_title, #qmbes_pic").hide().fadeIn('fast', function() {
				clickDisabledQMBES = false;
			});
		});
	});
	
	// FTP picture selector animation
	$("#ftp_picture_selector .circle_container").each(function() {
		$(this).children().click(function() {
			// Disable selector functionality until image animation completed 
			if(clickDisabledFTP) {
				return;
			}
			
			// Remove active class from all circles to reset for new selection 
			$("#ftp_picture_selector .circle").each(function() {
				$(this).removeClass('projects active');
			});
			
			// Set current picture selector circle as active
			$(this).children().addClass('projects active');
			
			// Change picture and title
			var pictureNum = parseInt($(this).attr('class').replace("circle_", ""));
			$("#ftp_pic").attr('src', "assets/images/projects/ftp/ftp_" + pictureNum + ".png");
			$("#ftp_picture_title").text(ftpProjectTitles[pictureNum - 1]);
			
			// Animation
			clickDisabledFTP = true;
			$("#ftp_picture_title, #ftp_pic").hide().fadeIn('fast', function() {
				clickDisabledFTP = false;
			});
		});
	});
	
	// Packet Patrol picture selector animation
	$("#packetpatrol_picture_selector .circle_container").each(function(){
		$(this).children().click(function(){
			// Disable selector functionality until image animation completed 
			if(clickDisabledPP)
			{
				return;
			}
			
			// Remove active class from all circles to reset for new selection 
			$("#packetpatrol_picture_selector .circle").each(function(){
				$(this).removeClass('projects active');
			});
			
			// Set current picture selector circle as active
			$(this).children().addClass('projects active');
			
			// Change picture and title
			var pictureNum = parseInt($(this).attr('class').replace("circle_", ""));
			$("#packetpatrol_pic").attr('src', "assets/images/projects/packetpatrol/packetpatrol_" + pictureNum + ".png");
			$("#packetpatrol_picture_title").text(ppProjectTitles[pictureNum - 1]);
			
			// Animation
			clickDisabledPP = true;
			$("#packetpatrol_picture_title, #packetpatrol_pic").hide().fadeIn('fast', function() {
				clickDisabledPP = false;
			});
		});
	});
	
	/* Keeping for possible future use
	$(".github_button").click(function(){
		var href = $(this).attr('href');
		if(href === "javascript:;")
		{
			alert("Coming soon!");
		}
	});
	*/
});