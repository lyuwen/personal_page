$(function() {
    if ($(window).width()>600){
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", "static/css/base_anim.css")
        document.getElementsByTagName("head")[0].appendChild(fileref)
        $(".main").UIPageScrolling({
            sectionsControl:".page-control__item",
            captureTouch: true,
            time: 500,
            captureKeyboard:true,
        });
    }else{
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", "static/css/base_plain.css")
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }

})

function resize() { 
    /*ToDO resize*/
}