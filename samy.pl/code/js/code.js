var s=["█","▓","▒","░","█","▓","▒","░","█","▓","▒","░","<",">","/"];
//baffle('#menutitle', { characters: s }).start().text(currentText => 'samy kamkar').reveal(5000, 1000);
baffle('#menutitle', { characters: s }).start().text(function (currentText) { return 'samy kamkar ≈)'; }).reveal(5000, 1000);
