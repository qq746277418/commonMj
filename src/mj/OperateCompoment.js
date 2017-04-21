var OperationNode = cc.Node.extend({
	m_operateObj: null,
	m_type: -1,   //操作牌类型
	//用整图非plist整合图
	m_cardList: [],
	m_pengCard: null,   //测试尝试，碰牌的中间那张，用于变动续杠位置
	m_resource: null,  //textureCache
	m_twidth: 0,
	m_theight: 0,
	m_itemWidth: 0,
	m_itemHeight: 0,
	m_offset: cc.size(0, 0),
	m_chiPengGangSound: "res/GameUI/SparrowUI/music/CHI_PENG_GANG.mp3",
	ctor: function(operate_obj)
	{
		this._super();
		this.m_operateObj = operate_obj;
		this.m_type = operate_obj.getType();

		// //会出现 碰变杠情况
		this.m_gangOffset = [];
		this.m_gangOffset[PlayerType.bottom] = {x: 0, y: 19};
		this.m_gangOffset[PlayerType.left] = {x: 0, y: 6};
		this.m_gangOffset[PlayerType.right] = {x: 0, y: 6};
		this.m_gangOffset[PlayerType.top] = {x: 1, y: 16};
		//
		this.m_pointOffset = [];
		this.m_pointOffset[PlayerType.bottom] = {w: -4, h: 0};
		this.m_pointOffset[PlayerType.left] = 	{w: 0, 	h: -12};
		this.m_pointOffset[PlayerType.right] =	{w: 0, 	h: -12};
		this.m_pointOffset[PlayerType.top] =	{w: -4, h: 0};
		this.m_offset = this.m_pointOffset[this.m_type];
	},

	createOperatorNode: function(oType, cardArr, ret)
	{
		if (oType == MJ.OperatorType.chi){
			this._chiNodeArray(cardArr);
		} else if (oType == MJ.OperatorType.peng) {
			this._pengNodeArray(cardArr);
		} else if (oType == MJ.OperatorType.mgang || oType == MJ.OperatorType.xgang) {
			//选杠、明杠都是全展示
			this._mGangNodeArray(cardArr);
		} else if (oType == MJ.OperatorType.agang) {
			this._anGangNodeArray(cardArr);
		}
	},

	_createOneMjCard: function(card_data, idx)
	{
		idx = idx == null? 0 : idx;
		cc.assert(card_data != 0, "error: not find this card data!");
		var card = new MjCard();
		card.setCardValue(card_data);
		card.setCardValueStr(card_data);
		this.m_itemWidth = card.getItemWidth();
		this.m_itemHeight = card.getItemHeight();
		this.addChild(card);
		this.m_cardList.push(card);
		if (this.m_type == MJ.PlayerType.right)
			card.setLocalZOrder(-idx);

		this.m_operateObj.pushOperatorCard(card);  //外来者
		return card;
	},

	_setCardPoint: function(idx)
	{
		var point = cc.p(0, 0);
		if (this.m_type == MJ.PlayerType.bottom){
			point.x = -idx * (this.m_itemWidth+this.m_offset.w);
		} else if (this.m_type == MJ.PlayerType.left) {
			point.y = -idx * (this.m_itemHeight+this.m_offset.h);  //-3 误差
		} else if (this.m_type == MJ.PlayerType.right) {
			point.y = idx * (this.m_itemHeight+this.m_offset.h);
		} else if (this.m_type == MJ.PlayerType.top) {
			point.x = -idx * (this.m_itemWidth+this.m_offset.w);
		}
		return point;
	},

	_isSortCardArr: function(cardArr)
	{
		if (this.m_type == MJ.PlayerType.bottom){
			return cardArr.sort(function(a, b){ return a < b; });
		}
		return cardArr;
	},

	_chiNodeArray: function(cardArr)
	{
		cardArr = this._isSortCardArr(cardArr);
		var clength = cardArr.length - 1;
		for (var i = 0; i <= clength; i++){
			var card = this._createOneMjCard(cardArr[i], i);
			var point = this._setCardPoint(i);
			card.setPosition(point);
		}
	},

	_pengNodeArray: function(cardArr)
	{
		var clength = cardArr.length - 1;
		for (var i = 0; i <= clength; i++){
			var card = this._createOneMjCard(cardArr[i], i);
			var point = this._setCardPoint(i);
			card.setPosition(point);
			if(i == 1)
				this.m_pengCard = card;
		}
	},

	_mGangNodeArray: function(cardArr)
	{
		//四张 有一张碟在最上面
		var clength = cardArr.length - 1;
		var centerCard = null;
		for (var i = 0; i < clength; i++){
			var card = this._createOneMjCard(cardArr[i], i);
			var point = this._setCardPoint(i);
			card.setPosition(point);
			if (i == 1)
				centerCard = card;
		}
		var lcard = this._createOneMjCard(cardArr[clength]);
		//每个位置上的偏移量肯定是不一致的
		var offset = this.m_gangOffset[this.m_type];
		lcard.setPosition(cc.p(X(centerCard) + offset.x, Y(centerCard) + offset.y));
	},

	changePengToGang: function(cardArr) 
	{
		var lcard = this._createOneMjCard(cardArr[0]);
		//每个位置上的偏移量肯定是不一致的
		var offset = this.m_gangOffset[this.m_type];
		lcard.setPosition(cc.p(X(this.m_pengCard) + offset.x, Y(this.m_pengCard) + offset.y));
	},

	_anGangNodeArray: function(cardArr)
	{
		var clength = cardArr.length - 1;
		var centerCard = null;
		for (var i = 0; i < clength; i++){
			var card = this._createOneMjCard(cardArr[i], i);
			card.setJSpriteTexture(CMD_WG.AnCardRes[this.m_type]);
			var point = this._setCardPoint(i);
			card.setPosition(point);
			if (i == 1)
				centerCard = card;
		}
		var lcard = this._createOneMjCard(cardArr[clength]);
		var offset = this.m_gangOffset[this.m_type];
		lcard.setPosition(cc.p(X(centerCard) + offset.x, Y(centerCard) + offset.y));
	},

	//GET
	getWidth: function()
	{
		//总的占宽  
		return (this.m_itemWidth+this.m_offset.w) * 3;
	},

	getHeight: function()
	{
		return (this.m_itemHeight+this.m_offset.h) * 3;
	}
});

//从放的位置开始往回排列

var OperateCompoment = cc.Node.extend({
	m_type: -1,
	m_operatorList: [],  //根据类型存储(暂时只存碰)
	m_operatorCards: [],
	m_operatorNum: [0, 0, 0, 0],
	m_currentX: 0,
	m_currentY: 0,
	m_operationDis: 20,   //每个操作牌节点的间距
	ctor: function(type)
	{
		this._super();
		this.m_type = type;
	},

	reset: function()
	{
		this.removeAllChildren();
		this.m_operatorList = [];
		this.m_operatorCards = [];
		this.m_currentX = 0;
		this.m_currentY = 0;
		this.m_operatorNum = [0, 0, 0, 0];
	},

	createOneOperationNode: function(oType, cardArr, ret)
	{
		if (oType == CMD_WG.OperationType.xgang && this.m_operatorList[cardArr[0]]){
			//碰变杠  选杠情况
			this.m_operatorList[cardArr[0]].changePengToGang(cardArr);
		} else{
			var node = new OperationNode(this);
			node.createOperatorNode(oType, cardArr, ret);
			this.addChild(node);
			var nodeWidth = node.getWidth();
			var nodeHeight = node.getHeight();
			this.m_operatorNum[this.m_type]++;
			if (this.m_type == MJ.PlayerType.bottom){
				node.setPositionX(this.m_currentX);
				this.m_currentX -= (nodeWidth + this.m_operationDis);
			} else if (this.m_type == MJ.PlayerType.left) {
				node.setPositionY(this.m_currentY);
				this.m_currentY -= (nodeHeight + this.m_operationDis - 10);
			} else if (this.m_type == MJ.PlayerType.right) {
				node.setPositionY(this.m_currentY);
				this.m_currentY += (nodeHeight + this.m_operationDis-10);
			} else if (this.m_type == MJ.PlayerType.top) {
				node.setPositionX(this.m_currentX);
				this.m_currentX -= (nodeWidth + this.m_operationDis);
			}	

			//只存碰
			if (oType == CMD_WG.OperationType.peng){
				this.m_operatorList[cardArr[0]] = node;
			}
		}
	},

	pushOperatorCard: function(card)
	{
		var data = card.getCardValue();
		if (this.m_operatorCards[data] == null)
			this.m_operatorCards[data] = [];
		this.m_operatorCards[data].push(card);
	},

	changeColorSelectedCard: function(card_data, ret)
	{
		var cards = this.m_operatorCards[card_data];
		for (var k in cards){
			cards[k].setValueEqualColor(ret);
		}
	},

	getType: function()
	{
		return this.m_type;
	},

	getCurrentX: function()
	{
		return this.m_currentX;
	},

	getCurrentY: function()
	{
		return this.m_currentY;
	},

	getOperatorNum: function()
	{
		return this.m_operatorNum;
	}
});