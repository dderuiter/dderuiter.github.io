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

	var clickDisabledQMBES = false;
	var clickDisabledFTP = false;
	var clickDisabledPacketPatrol = false;
	
	// QMBES picture selector animation
	$("#qmbes_picture_selector .circle_container").each(function(){
		$(this).children().click(function(){
			// Disable selector functionality until image animation completed 
			if(clickDisabledQMBES)
			{
				return;
			}
			
			// Remove active class from all circles to reset for new selection 
			$("#qmbes_picture_selector .circle").each(function(){
				$(this).removeClass('projects active');
			});
			
			var className = $(this).attr('class');
			if(className === "circle_1")
			{
				$("#qmbes_pic").attr('src', 'assets/images/projects/qmbes_1.png');
			 	$(this).children().addClass('projects active');
				$("#qmbes_picture_title").text('Home Screen - Before Run');
			}
			else if(className === "circle_2")
			{
				$("#qmbes_pic").attr('src', 'assets/images/projects/qmbes_2.png');
				$(this).children().addClass('projects active');
				$("#qmbes_picture_title").text('Home Screen - After Run');
			}
			else if(className === "circle_3")
			{
				$("#qmbes_pic").attr('src', 'assets/images/projects/qmbes_3.png');
				$(this).children().addClass('projects active');
				$("#qmbes_picture_title").text('Minterm Tables');
			}
			else if(className === "circle_4")
			{
				$("#qmbes_pic").attr('src', 'assets/images/projects/qmbes_4.png');
				$(this).children().addClass('projects active');
				$("#qmbes_picture_title").text('Prime Implicant Charts');
			}
			else if(className === "circle_5")
			{
				$("#qmbes_pic").attr('src', 'assets/images/projects/qmbes_5.png');
				$(this).children().addClass('projects active');
				$("#qmbes_picture_title").text('About');
			}
			
			// Disable selector functionality for total animation time 
			clickDisabledQMBES = true;
			setTimeout(function(){clickDisabledQMBES = false;}, 800);
			
			// Animation
			$("#qmbes_picture_title").fadeTo(0, 0.0);
			$("#qmbes_picture_title").fadeTo(750, 1.0);
			$("#qmbes_pic").fadeTo(0, 0.0);
			$("#qmbes_pic").fadeTo(750, 1.0);
		});
	});
	
	// FTP picture selector animation
	$("#ftp_picture_selector .circle_container").each(function(){
		$(this).children().click(function(){
			// Disable selector functionality until image animation completed 
			if(clickDisabledFTP)
			{
				return;
			}
			
			// Remove active class from all circles to reset for new selection 
			$("#ftp_picture_selector .circle").each(function(){
				$(this).removeClass('projects active');
			});
			
			var className = $(this).attr('class');
			if(className === "circle_1")
			{
				$("#ftp_pic").attr('src', 'assets/images/projects/ftp_1.png');
			 	$(this).children().addClass('projects active');
				$("#ftp_picture_title").text('Home Screen - Not Connected');
			}
			else if(className === "circle_2")
			{
				$("#ftp_pic").attr('src', 'assets/images/projects/ftp_2.png');
				$(this).children().addClass('projects active');
				$("#ftp_picture_title").text('Home Screen - Connected');
			}
			
			// Disable selector functionality for total animation time 
			clickDisabledFTP = true;
			setTimeout(function(){clickDisabledFTP = false;}, 800);
			
			// Animation
			$("#ftp_picture_title").fadeTo(0, 0.0);
			$("#ftp_picture_title").fadeTo(750, 1.0);
			$("#ftp_pic").fadeTo(0, 0.0);
			$("#ftp_pic").fadeTo(750, 1.0);
		});
	});
	
	// Packet Patrol picture selector animation
	$("#packetpatrol_picture_selector .circle_container").each(function(){
		$(this).children().click(function(){
			// Disable selector functionality until image animation completed 
			if(clickDisabledPacketPatrol)
			{
				return;
			}
			
			// Remove active class from all circles to reset for new selection 
			$("#packetpatrol_picture_selector .circle").each(function(){
				$(this).removeClass('projects active');
			});
			
			var className = $(this).attr('class');
			if(className === "circle_1")
			{
				$("#packetpatrol_pic").attr('src', 'assets/images/projects/packetpatrol_1.png');
			 	$(this).children().addClass('projects active');
				$("#packetpatrol_picture_title").text('Home Screen - Not Connected');
			}
			else if(className === "circle_2")
			{
				$("#packetpatrol_pic").attr('src', 'assets/images/projects/packetpatrol_2.png');
				$(this).children().addClass('projects active');
				$("#packetpatrol_picture_title").text('Home Screen - Connected');
			}
			
			// Disable selector functionality for total animation time 
			clickDisabledPacketPatrol = true;
			setTimeout(function(){clickDisabledPacketPatrol = false;}, 800);
			
			// Animation
			$("#packetpatrol_picture_title").fadeTo(0, 0.0);
			$("#packetpatrol_picture_title").fadeTo(750, 1.0);
			$("#packetpatrol_pic").fadeTo(0, 0.0);
			$("#packetpatrol_pic").fadeTo(750, 1.0);
		});
	});
	
	$(".github_button").click(function(){
		var href = $(this).attr('href');
		if(href === "javascript:;")
		{
			alert("Coming soon!");
		}
	});
});