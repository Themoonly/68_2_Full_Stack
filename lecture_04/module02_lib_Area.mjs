function areaTriangle(b, h){
    return (b*h)/2; // หาพื้นที่สี่เหลี่ยม
}

function areaCircle(r){
    return Math.PI * r*r; // หาพื้นที่วงกลม
}

function areaSqr(w,l){
    return w*l;  //หาพื่นที่รอบวงกลม
}

export { areaCircle, areaTriangle, areaSqr};