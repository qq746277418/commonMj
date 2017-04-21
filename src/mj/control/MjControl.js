var MjControl = cc.Class.extend({
	m_seats: [0, 1, 2, 3],
	m_currentSeat: -1,

	ctor: function()
	{	

	},

	nextSeat: function()
	{
		this.m_currentSeat++;
		if (this.m_currentSeat > MJ.GamePlayer-1){
			this.m_currentSeat = 0;
		}
		return this.m_currentSeat;
	},

	setCurrentSeat: function(seat)
	{
		this.m_currentSeat = seat;
	}
});