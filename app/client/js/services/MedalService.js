(function(undefined) {
	"use strict";
	
	define(function() {
		return [
			"$http",
			function($http) {
				this.getAllMedals = function() {

					$http.get("/medals");

					return {
						data: [
							{
								name: "Melhor Nota",
								shortDescription: "Melhor pontuação no primeiro simulado",
								longDescription: "Entre todas as unidades do Chromos você obteve a" +
												 " nota 90 e foi a melhor pontuação",
								points: 10,
								imageHash: "aaaa",
								type: "chromos-gold",
								tags: [
									"simulado"
								]
							},
							{
								name: "Gênio da matemática",
								shortDescription: "Acertou mais de 90% das questões de matemática",
								longDescription: "Em todos os simulados que fez, você acertou quase" +
												 " quase todas as questões de matemática",
								points: 3,
								type: "gold",
								imageHash: "aaab",
								tags: [
									"simulado", "matemática"
								]
							},
							{
								name: "Menção honrosa",
								shortDescription: "Foi bem no segundo simulado mas pode melhorar!",
								longDescription: "Você ficou entre os 10% e 15% melhores do simulado" +
												 " e recebeu menção honrosa.",
								points: 10,
								type: "mention",
								imageHash: "aaac",
								tags: [
									"simulado"
								]
							},
							{
								name: "Ótima frequência",
								shortDescription: "Você participou de 3 monitorias no mês de julho",
								longDescription: "",
								points: 2,
								type: "frequency-gold",
								imageHash: "aaad",
								tags: [
									"frequency", "monitoring"
								]
							}
						]
					};
				};
			}
		];
	});

})();