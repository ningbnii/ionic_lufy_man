function Top(img) {
	base(this,LSprite,[]);
	var s = this;
	var w = document.body.clientWidth;
	var bitmap = new LBitmap(new LBitmapData(img));
	bitmap.rotate = 180;
	s.addChild(bitmap);
	var bitmapWidth = bitmap.getWidth();
	var num = Math.ceil(w/bitmapWidth);
	for (var i =1;i<num;i++){
		var newBitmap = bitmap.clone();
		newBitmap.x = bitmapWidth*i;
		s.addChild(newBitmap);
	}
	
}
