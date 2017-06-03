define([
    'Handlebars'
], function(Handlebars) {
    Handlebars.registerHelper('formatBtn', function(status, options){
        if(!status && status == 1){
           return $(".conBtn").html('<div class="Then-live tc lh27 inline_block p-a fs14 demandBtn" data-code="{{code}}" >确认接活</div>')  
        }else{
            return $(".conBtn").html('<div class="Then-live tc lh27 inline_block p-a fs14 demandBtn" data-code="{{code}}" >顺利结束</div>') 
        }

    });
    Handlebars.registerHelper('formatMoney', function(num, options){
        if(!num && num !== 0)
            return "--";
        num = +num;
        return (num / 1000).toFixed(2);
    });
    Handlebars.registerHelper('formatZeroMoney', function(num, places, options){
        if (typeof num == 'undefined' || typeof num != 'number') {
            return 0;
        }
        num = +(num || 0) / 1000;
        return num.toFixed(0);
    });

    Handlebars.registerHelper('compare', function(v1, v2, res1, res2, res3, options){
        if (v1 > v2) {
            return res1;
        } else if (v1 = v2) {
            return res2;
        } else {
            return res3;
        }
    });

    Handlebars.registerHelper('safeString', function(text, options){
        return new Handlebars.SafeString(text);
    });
    Handlebars.registerHelper('formatImage', function(pic, isAvatar, options){
        var defaultAvatar = __inline("../images/default-avatar.png");
        if(pic){
            pic = pic.split(/\|\|/)[0];
        }
        return pic ? (PIC_PREFIX + pic + THUMBNAIL_SUFFIX) : 
            (isAvatar && !isAvatar.name) ? defaultAvatar : "";
    });
    Handlebars.registerHelper('formatImageNews', function(pic, isAvatar, options){
        var defaultAvatar = __inline("../images/default-avatar.png");
        if(pic){
            pic = pic.split(/\|\|/)[0];
        }
        return pic ? (PIC_PREFIX + pic + THUMBNAIL_SUFFINEWS) : 
            (isAvatar && !isAvatar.name) ? defaultAvatar : "";
    });
    Handlebars.registerHelper('formatImageDemand', function(pic, isAvatar, options){
        var defaultAvatar = __inline("../images/default-avatar.png");
        if(pic){
            pic = pic.split(/\|\|/)[0];
        }
        return pic ? (PIC_PREFIX + pic + THUMBNAIL_SUFFIDEMAND) : 
            (isAvatar && !isAvatar.name) ? defaultAvatar : "";
    });
    Handlebars.registerHelper('formatNoSuffixImage', function(pic, isAvatar, options){
        var defaultAvatar = __inline("../images/default-avatar.png");
        if(pic){
            pic = pic.split(/\|\|/)[0];
        }
        return pic ? (PIC_PREFIX + pic) : 
            (isAvatar && !isAvatar.name) ? defaultAvatar : "";
    });
    Handlebars.registerHelper('formatListImage', function(pic, isAvatar, options){
        var defaultAvatar = __inline("../images/default-avatar.png");
        if(pic){
            pic = pic.split(/\|\|/)[0];
        }
        return pic ? (PIC_PREFIX + pic + THUMBNAIL_SUFFIN) : 
            (isAvatar && !isAvatar.name) ? defaultAvatar : "";
    });
    Handlebars.registerHelper('formateDateTime', function(date, options){
        return date ? new Date(date).format("yyyy-MM-dd hh:mm:ss") : "--";
    });
    Handlebars.registerHelper('formateDate', function(date, options){
        return date ? new Date(date).format("yyyy-MM-dd") : "--";
    });
    Handlebars.registerHelper('formatePointDate', function(date, options){
        return date ? new Date(date).format("yyyy.MM.dd") : "--";
    });
    Handlebars.registerHelper('formateTime', function(date, options){
        return date ? new Date(date).format("hh:mm") : "--";
    });
    Handlebars.registerHelper('clearTag', function(des, options){
        return des && des.replace(/(\<[^\>]+\>)|(\<\/[^\>]+\>)|(\<[^\/\>]+\/\>)/ig, "") || "";
    });
    
    return Handlebars;
});