var numQuestions = 10;

var numChoice = 4;

var answers = new Array(10);

answers[0] = "c";
answers[1] = "d";
answers[2] = "b";
answers[3] = "c";
answers[4] = "a";
answers[5] = "c";
answers[6] = "b";
answers[7] = "c";
answers[8] = "d";
answers[9] = "b";

function gradeMe(form) {
	var score = 0;
	var currentElt;
	var currentSelection;
	for (i=0; i<numQuestions; i++) {
		currentElt = i*numChoice;
		for (j=0; j<numChoice; j++) {
			currentSelection = form.elements[currentElt + j];
			if (currentSelection.checked) {
				if (currentSelection.value == answers[i]) {
					score++;
					break;
				}
			}
		}
	}

	score = Math.round(score/numQuestions*100);
	form.percentage.value = score + "%";
	var correctAnswers = "";
	for (i=1; i<=numQuestions; i++) {
		correctAnswers += i + ". " + answers[i-1] + "\r\n";

	}
	form.solutions.value = correctAnswers;
}
