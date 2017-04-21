var _skeyIndex = 0;
var CSchedule = cc.Class.extend({
	_time: 0,  //用于计算
	_currentTime: 0,
	_ttime: 0,      //总时间
	_dtTime: -1, //间隔，有时可能不会用于计算
	_isReverse: true, //是否倒序 (默认)
	_loop: false,  //循环
	_callTime: 0,  // 报警时间
	_updateListener: null,
	_endListener: null,
	_callListener: null,

	_scheduleKey: null,
	_isOnce: false,   //只调用一次
	//_scheduleRepeat: cc.REPEAT_FOREVER,
	_delayTime: -1, //延迟
	ctor: function(schedule_key, is_once)
	{	
		this._scheduleKey = schedule_key;
		if (this._scheduleKey == null)
			this._scheduleKey = cc.formatStr("schedule_%d", _skeyIndex++);
		//this._scheduleRepeat = repeat || cc.REPEAT_FOREVER;
		this._delayTime = -1;//delayTime || -1;
		this._isOnce = is_once;
	},

	start: function(ttime, dtTime, update_listener, end_listener)
	{
		this._updateListener = update_listener;
		this._endListener = end_listener;
		this._ttime = ttime;
		this._dtTime = dtTime;
		cc.director.getScheduler().schedule(this.__update, this, this._dtTime, cc.REPEAT_FOREVER, this._delayTime, false, this._scheduleKey);
	},

	restart: function()
	{
		cc.director.getScheduler().schedule(this.__update, this, this._dtTime, cc.REPEAT_FOREVER, this._delayTime, false, this._scheduleKey);
	},
	//手动停止 endEnable：是否启用end_listener
	stop: function(endEnable)
	{
		this.__endSchedule(endEnable);
	},

	__endSchedule: function(endEnable)
	{
		if (endEnable && typeof(this._endListener) == "function"){
			this._endListener();
		}
		cc.director.getScheduler().unschedule(this._scheduleKey, this);
		this._currentTime = 0;
		this._time = 0;
		//如果设置了循环 loop
		if (this._loop){
			this.restart();
		}
	},

	__update: function(dt)
	{
		//ttime == 0 ; 不计算时间， 属于repeat
		if (this._ttime != 0) {
			this._time += this._dtTime;
			this._currentTime = this._time;
			if (this._isReverse) {
				this._currentTime = this._ttime - this._time;
				if (this._currentTime <= 0)
					this.__endSchedule();
			} else{
				if (this._currentTime >= this._ttime)
					this.__endSchedule(true);
			}
		}
		if (this._updateListener && typeof(this._updateListener) == "function") {
			this._updateListener();
		}
		if (this._isOnce){
			this.stop();
		}
	},

	__isCall: function(){
		if (this._callTime != 0 && (this._currentTime > this._callTime || this._currentTime < this._callTime)){
			if (this._callListener && typeof(this._callListener) == "function"){
				this._callListener();
			}
			return true;
		}
	},

	//set
	IsReverse: function(ret)
	{
		this._isReverse = ret;
	},

	setLoop: function(ret)
	{
		this._loop = ret;
	},

	setCallTime: function(time)
	{
		this._callTime = time || 0;
	},

	setCallListener: function(listener)
	{
		this._callListener = listener;
	},

	changeUpdateListener: function(listener)
	{
		this._updateListener = listener;
	},

	changeEndListener: function(listener)
	{
		this._endListener = listener;
	},

	setScheduleDelayTime: function(time)
	{
		this._delayTime = time;
	},

	//get
	getCurrentTime: function()
	{
		return this._currentTime;
	}
});