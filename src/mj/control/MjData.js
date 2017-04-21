var MjData = cc.Class.extend({
	m_currentCards: MJ.CurrentCards,
	m_cardArr: [],  //全部牌数据
	m_cardNumArr: [],  //全部牌张数控制
	ctor: function()
	{
		this.initAllCardData();
	},

	initAllCardData: function()
	{
		this.m_cardArr = [];
		for (var i = 0; i < this.m_currentCards.length; i++) {
			for (var j = 1; j <= this.m_currentCards[i]; j++) {
				for (var k = 0; k < 4; k++) {
					this.m_cardArr.push(j + i*10);

					if (this.m_cardNumArr[j] == null)
						this.m_cardNumArr[j] = 0;
					this.m_cardNumArr++;
				}
			}
		}
	},

	//随机获取一张
	randGetCardData: function()
	{
		var randIdx = 0;//Math.floor(Math.random() * this.m_cardArr.length);
		var randData = this.m_cardArr[randIdx];
		this.m_cardArr.splice(randIdx, 1);
		this.m_cardNumArr[randData]--;
		return randData;
	},

	randGetCardDatas: function(num) 
	{
		var datas = []
		for (var i = 0; i < num; i++) {
			datas.push(this.randGetCardData());
		}
		return datas;
	},


	getCardNumArr: function()
	{
		return this.m_cardNumArr;
	}
});

