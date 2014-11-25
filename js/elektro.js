var Elektro = (Elektro) ? Elektro : {};
(function(){

	Elektro.utils = {
		format: function(value, baseUnit)
		{
			var unit, fixed;
			if(value >= 1000000000)
			{
				value = value / 1000000000;
				unit = 'G'+baseUnit;
			}
			else if(value >= 1000000)
			{
				value = value / 1000000;
				unit = 'M'+baseUnit;
			}
			else if(value >= 1000)
			{
				value = value / 1000;
				unit = 'k'+baseUnit;
			}
			else if(value <= 0.000000001)
			{
				value = value * 1000000000000;
				unit = 'p'+baseUnit;
			}
			else if(value <= 0.000001)
			{
				value = value * 1000000000;
				unit = 'n'+baseUnit;
			}
			else if(value <= 0.001)
			{
				value = value * 1000000;
				unit = 'u'+baseUnit;
			}
			else if(value < 1)
			{
				value = value * 1000;
				unit = 'm'+baseUnit;
			}
			else
			{
				unit = baseUnit;
			}
			fixed = (value > 0.1) ? 2 : 5;
			valueOutput = value.toFixed(fixed).replace('.00', '') + ' ' + unit;
			return valueOutput;
		}
	};

	Elektro.render = function()
	{
		var html;
		var div;

		this.init = function(divId)
		{
			div = document.getElementById(divId);
			html = new HtmlGenerator();
		};

		this.addH1 = function(text)
		{
			div.appendChild(html.h1({'text': text}));
		}

		this.addH2 = function(text)
		{
			div.appendChild(html.h2({'text': text}));
		}

		this.addP = function(text)
		{
			div.appendChild(html._simple('P', {'text': text}));
		}

		this.addSelect = function(name, options)
		{
			var optionsFormated = [];
			for(key in options) optionsFormated.push({value: options[key].name, text: options[key].name});
			div.appendChild(html.select({'name': name, 'id': name, 'options': optionsFormated}));
		}

	};

	Elektro.parts = function()
	{
		var capacitors = [];
		var resistors  = [];

		var generate = function(dividers, unit)
		{
			var sizes = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
			var scales = [1, 10, 100];
			var generated = [];
			for(key in dividers)
			{
				var scale, scaleLength;
				for(scale = 0, scaleLength = scales.length; scale < scaleLength; ++scale)
				{
					var size, sizeLength;
					for(size = 0, sizeLength = sizes.length; size < sizeLength; ++size)
					{
						var value, name;
						value = (scales[scale] * sizes[size]);
						name = value;
						name = name.toFixed(1);
						name += key;
						name = name.replace('.0', '');
						value = value * dividers[key];
						generated.push({name: Elektro.utils.format(value, unit), value: value});
					}
				}
			}
			return generated;
		}

		var generateCapacitors = function()
		{
			capacitors = generate({ p: 0.000000000001, n: 0.000000001, u: 0.000001, m: 0.001 }, 'F');
		};

		var generateResistors = function()
		{
			resistors = generate({ ohm: 1, kohm: 1000, Mohm: 1000000 }, 'Ohm');
		};

		this.init = function()
		{
			generateCapacitors();
			generateResistors();
		};

		this.getCapacitors = function()
		{
			return capacitors;
		};

		this.getCapacitor = function(key)
		{
			var value = 0;
			var i;
			var length = capacitors.length;
			for(i = 0; i < length; i++)
			{
				if(capacitors[i].name === key)
				{
					value = capacitors[i].value;
					break;
				}
			}
			return value;
		};


		this.getResitors = function()
		{
			return resistors;
		}

		this.getResitor = function(key)
		{
			var value = 0;
			var i;
			var length = resistors.length;
			for(i = 0; i < length; i++)
			{
				if(resistors[i].name === key)
				{
					value = resistors[i].value;
					break;
				}
			}
			return value;
		}

		var formatFrequency = function(frequency)
		{
			return Elektro.utils.format(frequency, 'Hz');
		};

		var formatTime = function(time)
		{
			return Elektro.utils.format(time, 's');
		};

		this.rc = function(rId, cId)
		{
			var r = document.getElementById(rId).value;
			var c = document.getElementById(cId).value;
			var frequency = 1 / (2 * 3.14 * this.getResitor(r) * this.getCapacitor(c) );
			var frequencyFormated = formatFrequency(frequency);
			return { frequency: frequencyFormated.frequency + frequencyFormated.unit };
		};

		this.astable555 = function(r1Id, r2Id, cId)
		{
			var r1 = document.getElementById(r1Id).value;
			var r2 = document.getElementById(r2Id).value;
			var c = document.getElementById(cId).value;
			var frequency = 1 / ( Math.log( 2 ) * this.getCapacitor(c) * ( this.getResitor(r1) + ( 2 * this.getResitor(r2) ) ) );
			var high = ( Math.log( 2 ) * this.getCapacitor(c) * ( this.getResitor(r1) + this.getResitor(r2) ) );
			var low = ( Math.log( 2 ) * this.getCapacitor(c) * this.getResitor(r2) );
			var cycle = low + high;
			var frequencyFormated = formatFrequency(frequency);
			var highFormated = formatTime(high);
			var lowFormated = formatTime(low);
			var cycleFormated = formatTime(cycle);
			return { frequency: frequencyFormated, time: { high: highFormated, low: lowFormated, all: cycleFormated } };
		};
	};


	Elektro.timer555 = function()
	{
		var render, parts;

		var names = {
			r1: 'resistor1-timer555',
			r2: 'resistor2-timer555',
			c:  'capacitor-timer555'
		}

		var recalc = function(event)
		{
			var value = parts.astable555(names.r1, names.r2, names.c);
			var text  = 'Frequency: ' + value.frequency + ', time: ' + value.time.all + ' (high: ' + value.time.high + ' / low: ' + value.time.low + ')';
			render.addP(text);
			console.log(value);
		}

		this.init = function(divId)
		{
			render = new Elektro.render();
			parts  = new Elektro.parts();
			render.init(divId);
			parts.init();
			render.addH1('Timer 555');
			render.addP('simple timer 555 calculators');
			var resistors = parts.getResitors();
			var capacitors = parts.getCapacitors();
			render.addSelect(names.r1, resistors);
			render.addSelect(names.r2, resistors);
			render.addSelect(names.c, capacitors);
			document.getElementById(names.r1).addEventListener('change', recalc, false);
			document.getElementById(names.r2).addEventListener('change', recalc, false);
			document.getElementById(names.c).addEventListener('change', recalc, false);
		};

	}
})();