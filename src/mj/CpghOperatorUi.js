//吃 碰 杠 胡 过 操作按钮
var CpghOperatorUi = cc.Node.extend({
	m_res: [],  //资源 表
	m_buttons: [],
	ctor: function()
	{
		this._super();

		//本身就是排好顺序的
		this.m_res = [
			{normal: "BT_CHI_1.png", pressed: "BT_CHI_2.png"},
			{normal: "BT_PENG_1.png", pressed: "BT_PENG_2.png"},
			{normal: "BT_GANG_1.png", pressed: "BT_GANG_2.png"},
			{normal: "BT_HU_1.png", pressed: "BT_HU_2.png"},
			{normal: "BT_GIVEUP_1.png", pressed: "BT_GIVEUP_2.png"},
		];

		this._init();
	},

	_init: function()
	{
		for (var i = 0; i < this.m_res.length; i++) {
			var params = this.m_res[i];
			var button = new CButton(params);
			this.addChild(button);
			this.m_buttons.push(button);
			button.setVisible(true);
		}
	}
});