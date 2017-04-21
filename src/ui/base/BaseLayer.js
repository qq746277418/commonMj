/**
 * Created by Administrator on 2016/12/12 0012.
 */
var BaseLayer = cc.Layer.extend({
    m_pRootNode:null,
    //
    m_layerColor: null,
    m_winW: 0,
    m_winH: 0,
    ctor:function()
    {
        cc.log("ctor ... BaseLayer");
        this._super();
        this.m_winW = cc.winSize.width;
        this.m_winH = cc.winSize.height;
        return true;
    },

    addColorLayer: function(opacity)
    {
    	if (this.m_layerColor == null) {
    		this.m_layerColor = new cc.LayerColor(cc.color(0, 0, 0, opacity || 100));
    		this.addChild(this.m_layerColor);
    	}
    },	

    addLayerTouchListener: function()
    {
    	addNodeTouchEventListener(this, this._layerTouchListener.bind(this));
    },

    _layerTouchListener: function()
    {
    	//子類重謝這個函數使用
        return true;
    },

    close: function (time, scale) {
        cc.log("closePanel");
        this.m_pBallotTipPanel.runAction(cc.sequence(cc.scaleTo(time || 0.1, scale || 0.1),
            cc.callFunc(function() {
            this.removeFromParent();
        })));
    },
});
