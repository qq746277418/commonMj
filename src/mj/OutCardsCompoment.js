var OutCardsCodmpoment = cc.Node.extend({
	m_outCards: [],	  //所有打出去的麻将汇总(根据值来分开存储可能更好,不需要遍历查询)
	m_currentOutCard: null,
	m_outIdxs: [0, 0, 0, 0],
	m_currentChairId: -1,
	m_tCardsNum: 0,
	ctor: function()
	{
		this._super();	

		this.m_outCardOffect = [];
		this.m_outCardOffect[MJ.PlayerType.bottom] = {w: -4, h: -4};
		this.m_outCardOffect[MJ.PlayerType.right] = {w: -5, h: -12};
		this.m_outCardOffect[MJ.PlayerType.top] = {w: -4, h: -4};
		this.m_outCardOffect[MJ.PlayerType.left] = {w: -5, h: -12};
	},

	setOutCardsData: function(data, chairId)
	{
		this.m_currentChairId = chairId;
		this._initOutCards(data, chairId);
	},

	reset: function()
	{
		this.removeAllChildren();
		this.m_outCards = [];
		this.m_currentOutCard = null;
		this.m_outIdxs = [0, 0, 0, 0];
		this.m_tCardsNum = 0;
		this.m_currentChairId = -1;
	},

	//单排显示汇总
	showOutCard: function(card_data, chairId)
	{
		var arr = [];
		this.m_currentChairId = chairId;
		if (chairId == MJ.PlayerType.bottom){
			arr = this._addShowMyOutCard(card_data, chairId);
		} else if (chairId == MJ.PlayerType.left) {
			arr = this._addShowLeftOutCard(card_data, chairId);
		} else if (chairId == MJ.PlayerType.right) {
			arr = this._addShowRightOutCard(card_data, chairId);
			arr[0].setLocalZOrder(-this.m_tCardsNum);
		} else if (chairId == MJ.PlayerType.top) {
			arr = this._addShowTopOutCard(card_data, chairId);
		} 
		return arr;
	},

	//当前牌被碰、吃、杠、胡掉，都要拿走
	removeOutCard: function(card_data)
	{
		var lcardIdx = this.m_outCards[card_data].length-1;
		var card = this.m_outCards[card_data][lcardIdx];
		card.removeFromParent();
		this.m_outCards[card_data].pop();
		this.m_tCardsNum--;
		this.m_outIdxs[this.m_currentChairId]--;
	},

	changeColorSelectedCard: function(card_data, ret)
	{
		var cards = this.m_outCards[card_data];
		for (var k in cards){
			cards[k].setValueEqualColor(ret);
		}
	},

	_initOutCards: function(card_data, chairId)
	{
		for (var k in card_data){
			if (card_data[k] != 0){
				this.showOutCard(card_data[k], chairId);
			}
		}
	},

	_createMjData: function(card_data, chairId)
	{
		var card = new MjCard();
		card.setCardValue(card_data);
		card.setJSpriteFrame(func_get_card_str(chairId, card_data));
		this.addChild(card);

		if (this.m_outCards[card_data] == null)
			this.m_outCards[card_data] = new Array(4);
		this.m_outCards[card_data].push(card);
		return card;
	},

	//只有确定是不被操作的出牌才显示到 这里
	_addShowMyOutCard: function(card_data, chairId)
	{
		//限制显示条件
		var row = 13;
		var col = 5
		var card = this._createMjData(card_data, chairId);
		var idx = this.m_outIdxs[chairId]; //第二块
		var beganV = MJ.IintOutPoint[chairId]; //开始放的位置
		var offsetW = card.getItemWidth() + this.m_outCardOffect[chairId].w;
		var offsetH = card.getItemHeight() + this.m_outCardOffect[chairId].h;
		var x = beganV.x + idx % row * offsetW;
		var y = beganV.y + Math.floor(idx / row) * offsetH;
		card.setPosition(cc.p(x, y));
		this.m_outIdxs[chairId]++;
		this.m_tCardsNum++;
		return [card, cc.p(x, y)];
	},

	_addShowLeftOutCard: function(card_data, chairId)
	{
		//限制显示条件
		var row = 13;
		var col = 5
		var card = this._createMjData(card_data, chairId);
		var idx = this.m_outIdxs[chairId];
		var beganV = MJ.IintOutPoint[chairId];
		var offsetW = card.getItemWidth() + this.m_outCardOffect[chairId].w;
		var offsetH = card.getItemHeight() + this.m_outCardOffect[chairId].h;
		var y = beganV.y - idx % row * offsetH;
		var x = beganV.x + Math.floor(idx / row) * offsetW;
		card.setPosition(cc.p(x, y));
		this.m_outIdxs[chairId]++;
		this.m_tCardsNum++;
		return [card, cc.p(x, y)];
	},

	_addShowRightOutCard: function(card_data, chairId)
	{
		//限制显示条件
		var row = 13;
		var col = 5
		var card = this._createMjData(card_data, chairId);
		var idx = this.m_outIdxs[chairId];
		var beganV = MJ.IintOutPoint[chairId];
		var offsetW = card.getItemWidth() + this.m_outCardOffect[chairId].w;
		var offsetH = card.getItemHeight() + this.m_outCardOffect[chairId].h;
		var y = beganV.y + idx % row * offsetH;
		var x = beganV.x - Math.floor(idx / row) * offsetW;
		card.setPosition(cc.p(x, y));
		this.m_outIdxs[chairId]++;
		this.m_tCardsNum++;
		return [card, cc.p(x, y)];
	},

	_addShowTopOutCard: function(card_data, chairId)
	{
		//限制显示条件
		var row = 13;
		var col = 5
		var card = this._createMjData(card_data, chairId);
		var idx = this.m_outIdxs[chairId];
		var beganV = MJ.IintOutPoint[chairId];
		var offsetW = card.getItemWidth() + this.m_outCardOffect[chairId].w;
		var offsetH = card.getItemHeight() + this.m_outCardOffect[chairId].h;
		var x = beganV.x - idx % row * offsetW;
		var y = beganV.y - Math.floor(idx / row) * offsetH;
		card.setPosition(cc.p(x, y));
		this.m_outIdxs[chairId]++;
		this.m_tCardsNum++;
		return [card, cc.p(x, y)];
	}
});