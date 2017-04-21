var RuoZhiAI = cc.Class.extend({
	m_schedule: new CSchedule(null, true),
	m_cardData: null,
	m_playOutCardObserver: null, //出牌
	ctor: function()
	{

	},

	initCardData: function(datas)
	{
		this.m_cardData = datas;
	},

	addPlayOutObserver: function(observer){
		this.m_playOutCardObserver = observer;
	},	

	//抓牌打牌
	playOutCard: function(card_data, seat)
	{
		var func = function()
		{
			if(this.m_playOutCardObserver)
				this.m_playOutCardObserver(card_data, seat);
		}
		var schedule = new CSchedule(null, true);
		schedule.start(0, 0.3, func.bind(this));
		cc.log("-----", seat, card_data);
	}
});