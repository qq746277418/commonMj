var CButton = cc.Node.extend({
	m_normal: null, 
	m_pressed: null,
	m_disabled: null,
	m_value: null,
	m_pButton: null,
	ctor: function(params)
	{
		this._super();
		this.m_normal = params.normal;
		this.m_pressed = params.pressed || this.m_normal;
   	 	this.m_disabled = params.disabled || this.m_normal;
   	 	cc.log("----------------", this.m_normal)
    	this.m_pButton = new ccui.Button(this.m_normal, this.m_pressed, this.m_disabled);
    	this.addChild(this.m_pButton);
	},

	addButtonEventListener: function(listener)
	{
		this.m_pButton.addButtonEventListener(listener);
	},

	addButtonTouchListener: function(listener)
	{
		var touchListener = function(sender, type){
            var event = {};
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    event.name = "began";
                    break;
                case ccui.Widget.TOUCH_MOVED:
                    event.name = "moved";
                    break;
                case ccui.Widget.TOUCH_ENDED:
                    event.name = "ended";
                    break;
                case ccui.Widget.TOUCH_CANCELED:
                    event.name = "cancle";
                    break;
                default:
                    break;
            }
            listener(event);
        }
        this.m_pButton.addTouchEventListener(touchListener, this);
	},

	getValue: function()
	{
		return this.m_value;
	}
});