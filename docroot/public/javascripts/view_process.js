$(document).ready(function() {
    // http://www.masswerk.at/mespeak/#download
    initSpeaker();
    
    $('.read').click(function() {
        var texts = '';
        $('.step-list li.step').each(function(index, element) {
            //texts.push($(this).find('p.text').html());
            texts += 'lépés ' + (index + 1) + ', ';
            texts += $(this).find('p.text').html() + ', ';
        });
//        console.log(texts);
        meSpeak.speak(texts, {
            pitch: 50,
            variant: 'f2'
        });
    });
    
});

function initSpeaker() {
    meSpeak.loadConfig("/javascripts/lib/mespeak/mespeak_config.json");
    //meSpeak.loadVoice("/javascripts/lib/mespeak/voices/en/en-us.json");    
    meSpeak.loadVoice("/javascripts/lib/mespeak/voices/hu.json");    
}
