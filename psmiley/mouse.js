var recordingStatus = "off" // off, recording, replaying
var freshRecording = []
var prevTime = undefined
var prevX = undefined
var prevY = undefined
var offsetX = 0
var offsetY = 0
var userMoveCount = 0

var hideAllCursors = function() {
	const pointer = document.getElementById("pointer")
	const arrow = document.getElementById("arrow")
	pointer.style.visibility = "hidden";
	arrow.style.visibility = "hidden";
}
var paintCursorWithOffset = function(cursor, realX, realY) {
	const w = window.innerWidth;
	const h = window.innerHeight;
	var x = realX + offsetX
	var y = realY + offsetY
	if (x > w-24) {
		x = Math.max(realX, w-24)
	}
	if (y > h-24) {
		y = Math.max(realY, h-24)
	}
	if (x < 0) {
		x = 0
	}
	if (y < 0) {
		y = 0
	}
	cursor.style.top = y + "px"; 
	cursor.style.left = x + "px"; 
}
var mouseMovedOnBackground = function(event) {
	const x = event.clientX
	const y = event.clientY
	if (recordingStatus === "recording") {
		const time = Date.now()
		const timeDiff = time - prevTime
		const xDiff = x - prevX
		const yDiff = y - prevY
		prevTime = time
		freshRecording.push([timeDiff, xDiff, yDiff])
	}
	prevX = x
	prevY = y
	const pointer = document.getElementById("pointer")
	pointer.style.visibility = "hidden";
	const arrow = document.getElementById("arrow")
	arrow.style.visibility = "visible";
	paintCursorWithOffset(arrow, prevX, prevY)
	userMoveCount += 1
}
var mouseMovedOnButton = function(event) {
	if (recordingStatus === "replaying") {
		mouseMovedOnBackground(event);
		return;
	}
	const x = event.clientX
	const y = event.clientY
	prevX = x
	prevY = y
	const arrow = document.getElementById("arrow")
	arrow.style.visibility = "hidden";
	const pointer = document.getElementById("pointer")
	pointer.style.visibility = "visible";
	paintCursorWithOffset(pointer, x, y)
	userMoveCount += 1
}
var getCandidateVal = function(x, y, candidateX, candidateY) {
	return Math.sqrt((x - candidateX) * (x-candidateX) + (y - candidateY) * (y - candidateY))
}
var choose = function(previousBestCandidate, candidateX, candidateY, x, y) {
	const candidateVal = getCandidateVal(x, y, candidateX, candidateY)
	if (!previousBestCandidate || candidateVal < previousBestCandidate.val) {
		return {
			'val': candidateVal,
			'x': candidateX,
			'y': candidateY
		}
	}
	return previousBestCandidate
}
var mouseMovedOnHowdy = function(event) {
	if (recordingStatus === "replaying") {
		mouseMovedOnBackground(event);
		return;
	}
	const x = event.clientX
	const y = event.clientY

	// Offset mouse to the nearest side of howdy-button.
	const bounds = document.getElementById("how").getBoundingClientRect()
	var bestCandidate = null
	bestCandidate = choose(bestCandidate, bounds.left-10, y, x, y) // left
	bestCandidate = choose(bestCandidate, x, bounds.top-10, x, y) // up
	bestCandidate = choose(bestCandidate, x, bounds.bottom+10, x, y) // down
	bestCandidate = choose(bestCandidate, bounds.right+10, y, x, y) // right
	offsetX = bestCandidate.x - x
	offsetY = bestCandidate.y - y

	prevX = x
	prevY = y
	const pointer = document.getElementById("pointer")
	pointer.style.visibility = "hidden";
	const arrow = document.getElementById("arrow")
	arrow.style.visibility = "visible";
	paintCursorWithOffset(arrow, x, y)
	userMoveCount += 1
}
var recordingIndex = 0
var step = 0
var recursiveTimerReplay = function() {
	const rec = recordings[recordingIndex]
	if (step >= rec.length) {
		recordingStatus = "off"
		document.getElementById("howdiv").style.visibility = "visible";
		offsetX = 0
		offsetY = 0
		paintCursorWithOffset(document.getElementById("arrow"), prevX, prevY)
		step = 0
		recordingIndex = (recordingIndex + 1) % recordings.length
		return
	}
	const currTime = Date.now()
	if (currTime - prevTime >= rec[step][0]) {
		offsetX = offsetX + rec[step][1]
		offsetY = offsetY + rec[step][2]
		step = step + 1
		paintCursorWithOffset(document.getElementById("arrow"), prevX, prevY)
		prevTime = currTime
	}
	setTimeout(() => { recursiveTimerReplay() }, 0)
}
var replayMovements = function(event) {
	const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	if (width < 800 || typeof(prevX) == "undefined" || userMoveCount < 5) {
		alert("Sorry, we can't do the trick on your device. Please try again with a desktop/laptop that has a mouse attached and has screen width of at least 800 pixels.")
		return
	}
	recordingStatus = "replaying"
	arrow = document.getElementById("arrow")
	paintCursorWithOffset(arrow, prevX, prevY)
	document.getElementById("pointer").style.visibility = "hidden";
	arrow.style.visibility = "visible";
	document.getElementById("howdiv").style.visibility = "hidden";
	prevTime = Date.now()
	recursiveTimerReplay()
}

document.addEventListener('contextmenu', e => {
	if (recordingStatus == 'replaying') {
		e.preventDefault();
	}
});
