(function(){
	Client = function()
	{
		var timer555;

		this.run = function()
		{
			timer555 = new Elektro.timer555();
			timer555.init('timer555');
		};
	};

	window.onload = function()
	{
		var client = new Client();
		client.run();
	}
})();