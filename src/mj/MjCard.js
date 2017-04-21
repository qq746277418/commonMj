var MjCard = cc.Node.extend({
	//began 用于rect裁剪
	m_16_value: 0,				//牌值16进制数据
	m_value: 0,					//可能用于处理逻辑的数据
	m_wIndex: 0,				//在大图中的位置，也代表了类型中的值
	m_type: 0,					//代表牌的类型， 也是大图中竖排的位置
	m_itemWidth: 0,				//每张麻将图在大图中的大小
	m_itemHeight: 0,			
	m_selected: false,			//是否选中
	m_seat: -1,
	//end
	m_sordId: 0,    			//在手牌这类组件中的序号（用于手牌）
	m_tagSetId: 0,  			//临时操作属性(类似tag使用)
	//ui
	m_texture: null,  			//cc.textureCache 一张整图资源
	m_sprite: null,				//麻将主体精灵
	ctor: function()
	{
		this._super();

		this.m_sprite = new cc.Sprite();
		this.addChild(this.m_sprite);
	},

	//展示灰牌（与手牌选中同值）
	setValueEqualColor: function(ret)	
	{	
		if (ret){
			this.m_sprite.setColor(cc.color(108, 108, 108));
		} else {
			this.m_sprite.setColor(cc.color(255, 255, 255));
		}
	},

	// began 整图 (WG)
	// setJTexture: function(texture)
	// {
	// 	this.m_texture = texture;
	// 	this.m_twidth = W(this.m_texture);
	// 	this.m_theight = H(this.m_texture);
	// },

	// drawTextureRect: function(rect)
	// {
	// 	this.m_sprite.setSpriteFrame(cc.SpriteFrame.createWithTexture(this.m_texture, rect));
	// },

	// drawTextureRectByMine: function()
	// {
	// 	var x = (this.m_wIndex -1) * this.m_itemWidth;
	// 	var y = this.m_type * this.m_itemHeight;
	// 	var rect = cc.rect(x, y, this.m_itemWidth, this.m_itemHeight);
	// 	this.m_sprite.setSpriteFrame(cc.SpriteFrame.createWithTexture(this.m_texture, rect));
	// },

	// _countType: function()
	// {
	// 	//计算type
	// 	var str = this.m_16_value.toString();
	// 	this.m_type = parseInt(str.slice(2, 3));
	// 	this.m_wIndex = parseInt(str.slice(3, 4));
	// },
	//end 

	//单张帧图
	setJSpriteFrame: function(sprite_frame)
	{
		this.m_sprite.setSpriteFrame(sprite_frame);
		this.m_itemWidth = W(this.m_sprite);
		this.m_itemHeight = H(this.m_sprite);
	},

	//单张散图
	setJSpriteTexture: function(sprite_texture)
	{
		this.m_sprite.setTexture(sprite_texture);
		this.m_itemWidth = W(this.m_sprite);
		this.m_itemHeight = H(this.m_sprite);
	},

	//SET
	// setItemWidthAndHeight: function(w, h)
	// {
	// 	this.m_itemWidth = w;
	// 	this.m_itemHeight = h;
	// },
	setSeat: function(seat)
	{

	},

	setCardValue: function(value)
	{
		this.m_value = value;
		this.m_type = Math.floor((value-1) / 9);
	},

	//
	setSordId: function(id)
	{
		this.m_sordId = id;
	},

	setTagSetId: function(val)
	{
		this.m_tagSetId = val;
	},

	setIsSelected: function(ret)
	{
		this.m_selected = ret;
	},

	//GET
	getCardValue: function()
	{
		return this.m_value;
	},

	getCardValue16: function()
	{
		return this.m_16_value;
	},

	getType: function()
	{
		return this.m_type;
	},

	gettWidth: function()
	{
		return this.m_twidth;
	},

	gettHeight: function()
	{
		return this.m_theight;
	},

	getItemWidth: function()
	{
		return this.m_itemWidth;
	},

	getItemHeight: function()
	{
		return this.m_itemHeight;
	},

	isSelected: function()
	{
		return this.m_selected;
	},

	getSortId: function()
	{
		return this.m_sordId;
	},

	getTagSetId: function()
	{
		return this.m_tagSetId;
	},

	getSprite: function()
	{
		return this.m_sprite;
	},
});