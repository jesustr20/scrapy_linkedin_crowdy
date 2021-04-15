let btnscrap=document.getElementById('btnscrap')

btnscrap.addEventListener('click', async () =>{
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})
    chrome.scripting.executeScript({
        target:{tabId: tab.id},
        function: scrapingProfile,
    });  
})

async function scrapingProfile(){
    
    const cssSelectorProfile = {
        profile:{
            name:'div.ph5 > div.mt2 > div > ul > li',
            resume:'div.ph5 > div.mt2 > div > h2.mt1',
            country: 'div.ph5 > div.mt2 > div > ul.mt1 > li.t-16',
            buttonSeeMore: '[data-control-name="contact_see_more"]',
            email : 'div > section.pv-contact-info__contact-type.ci-email > div.pv-contact-info__ci-container.t-14 > a',
            phone : 'div > section.pv-contact-info__contact-type.ci-phone > ul > li.t-14 > span',
            buttonCloseSeeMore: 'button.artdeco-modal__dismiss'
        }
    }

    //utils
    const wait = (milliseconds) =>{
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve()
            }, milliseconds);
        });
    };

    const autoscrollToElement = async function(cssSelector){
        var exists = document.querySelector(cssSelector);

        while(exists){
            let maxScrollTop = document.body.clientHeight - window.innerHeight;
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight;
            let currentScrollTop = window.scrollY

            if(maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
                break;

            await wait(32)

            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);
            window.scrollTo(0, newScrollTop)
            
        }
        console.log('finish autoscroll to element %s', cssSelector);
        
        return new Promise(function(resolve){
            resolve();
        });
    };

    //Profile
    const getContactProfile = async() =>{

        const { profile:{
                        buttonSeeMore:buttonSeeMoreCss,
                        buttonCloseSeeMore: buttonCloseSeeMoreCss,
                        name:nameCss, 
                        resume:resumeCss, 
                        country:countryCss,
                        phone:phoneCss,
                        email:emailCss}} = cssSelectorProfile;

        const name = document.querySelector(nameCss)?.innerText
        const resume = document.querySelector(resumeCss)?.innerText
        const country = document.querySelector(countryCss)?.innerText

        //Get email and phone with click on "See more"

        const buttonSeeMore = document.querySelector(buttonSeeMoreCss)
        buttonSeeMore.click()
        
        await wait(3000)

        const phone = document.querySelector(phoneCss)?.innerHTML.trim()
        const email = document.querySelector(emailCss)?.innerHTML.trim()
        
        //const buttonCloseSeeMore = document.querySelector(buttonCloseSeeMoreCss)
        //buttonCloseSeeMore.click()
        document.querySelector(buttonCloseSeeMoreCss).click()

        return {profile:{name, resume, country, phone, email}}
    }

    //Acerca de:
    //Actividad

    //Experiencia
    const cssSelectorExperience = {
        experience:{
            section:'div.pv-profile-section-pager.ember-view>section.pv-profile-section.experience-section.ember-view>header>h2',
            empresa: 'div.pv-profile-section-pager.ember-view>section.pv-profile-section.experience-section.ember-view>ul>li>section>div>a>div>div.pv-entity__company-summary-info>h3>span.visually-hidden~span',
            tiempo:'div.pv-entity__company-summary-info>h4>span.visually-hidden~span',
            cargo:'div.pv-entity__summary-info-v2.pv-entity__summary-info--background-section.pv-entity__summary-info-margin-top.mb2>h3>span.visually-hidden~span',
            fempleo:'div.pv-entity__summary-info-v2.pv-entity__summary-info--background-section.pv-entity__summary-info-margin-top.mb2>div>h4>span.visually-hidden~span',
            dempleo:'div.pv-entity__summary-info-v2.pv-entity__summary-info--background-section.pv-entity__summary-info-margin-top.mb2>div>h4~h4>span~span',
            lugar:'div.pv-entity__summary-info-v2.pv-entity__summary-info--background-section.pv-entity__summary-info-margin-top.mb2>h4>span~span',
            detalle:'div.pv-entity__extra-details.t-14.t-black--light.ember-view>p'
        }
    }

    const getContactExperience = async() =>{
        const { experience:{
            section:sectionCss,
            empresa: empresaCss,
            tiempo: tiempoCss,
            cargo: cargoCss,
            fempleo:fempleoCss,
            dempleo:dempleoCss,
            lugar:lugarCss,
            detalle:detalleCss

        }} = cssSelectorExperience;

        const section = document.querySelector(sectionCss)?.innerHTML.trim()
        const empresa = document.querySelector(empresaCss)?.innerHTML
        const tiempo = document.querySelector(tiempoCss)?.innerHTML
        const cargo = document.querySelector(cargoCss)?.innerHTML
        const fempleo = document.querySelector(fempleoCss)?.innerHTML
        const dempleo = document.querySelector(dempleoCss)?.innerHTML
        const lugar = document.querySelector(lugarCss)?.innerHTML
        const detalle = document.querySelector(detalleCss)?.innerHTML


        return {experience:{section, empresa, tiempo, cargo,fempleo,dempleo,lugar,detalle}}
    }

    const cssSelectorEducation = {
        education:{
            section2:'div.pv-profile-section-pager.ember-view>section.pv-profile-section.education-section.ember-view>header>h2',
            nombre: 'li.pv-profile-section__list-item.pv-education-entity.pv-profile-section__card-item.ember-view>div>div>a>div.pv-entity__summary-info.pv-entity__summary-info--background-section>div>h3',
            nameTitulation:'li.pv-profile-section__list-item.pv-education-entity.pv-profile-section__card-item.ember-view>div>div>a>div.pv-entity__summary-info.pv-entity__summary-info--background-section>div>p>span~span',
            fechaEstudioInicio:'li.pv-profile-section__list-item.pv-education-entity.pv-profile-section__card-item.ember-view>div>div>a>div.pv-entity__summary-info.pv-entity__summary-info--background-section>p>span~span>time',
            fechaEstudioFinal:'li.pv-profile-section__list-item.pv-education-entity.pv-profile-section__card-item.ember-view>div>div>a>div.pv-entity__summary-info.pv-entity__summary-info--background-section>p>span~span>time~time'
        }
    }

    const getContactEducation = async() =>{
        const { education:{
            section2:section2Css,
            nombre: nombreCss,
            nameTitulation: nameTitulationCss,
            fechaEstudioInicio: fechaEstudioInicioCss,
            fechaEstudioFinal:fechaEstudioFinalCss}} = cssSelectorEducation;

        const section2 = document.querySelector(section2Css)?.innerHTML.trim()
        const nombre = document.querySelector(nombreCss)?.innerHTML
        const nameTitulation = document.querySelector(nameTitulationCss)?.innerHTML
        const fechaEstudioInicio = document.querySelector(fechaEstudioInicioCss)?.innerHTML
        const fechaEstudioFinal = document.querySelector(fechaEstudioFinalCss)?.innerHTML
    
        return {education:{section2,nombre,nameTitulation,fechaEstudioInicio,fechaEstudioFinal}}
}

    const getProfile = async () =>{
        const profile = await getContactProfile();
        const experience = await getContactExperience();
        const education = await getContactEducation();
        await autoscrollToElement('body')
        console.log(profile, experience,education)
    }

    getProfile()
    
} 