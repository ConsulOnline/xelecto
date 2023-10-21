// JavaScript Document
var paramLogin = {
	urlregistraUte : '/blog/UtentiRegistra.asp',
	loginCliente : true,
	redirectCli : true,
	loginAgente : true,
	redirectAge : true,
	loginUtente : true,
	redirectUte : true		
}


/* funzione di inizializzazione generale richiamata al termine della pagina */
function inizializeObject(param){
	
	wg_Inizializza({TipoSito:'Ecommerce'});
	
	wg_AutocompletamentoRicerca();
	
	/*jQuery('#000001').on('click', function(e) {
		  wg_Login(paramLogin);
	});*/
	
	if (typeof(localInizialize) == 'function'){
		localInizialize()
	}
	backToTop();
	
	
	$('#wg_RicercaGlobale').click(function(event){
		event.preventDefault();
		IscrizioneNewsletter();	
	});
	
//	$('#wg_Menu').find('a').click(function(event) {
//		event.preventDefault();
//		ScrollSection(this);
//	});
//	$('#asideMenu').find('a').click(function(event) {
//		event.preventDefault();
//		ScrollSectionMobile(this);
//	});
	$(window).on('scroll',fix_scroll);
	
//	if(wg_cookieGet('CodLingua') == 'ITA'){
//		window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
//		d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
//		_.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
//		$.src="https://v2.zopim.com/?5pewTGKtU1Oj05DtKy2h93IhRh8Yn5C9";z.t=+new Date;$.
//		type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
//	}
	
}


function fix_scroll() {
  var s = $(window).scrollTop();
  var fixedTitle = $('#asideMenu ul:first-child');
  fixedTitle.css('position','absolute');
  fixedTitle.css('top',s + 'px');
}fix_scroll();



/*INIZIO BACK TO TOP*/
function backToTop(){
	var offset = 700;
	var duration = 300;
	
	jQuery(window).scroll(function() {
		if (jQuery(this).scrollTop() != 0) {
			if (jQuery(this).scrollTop() > offset) {
				jQuery(".back-to-top").fadeIn(duration);
			} else {
				jQuery(".back-to-top").fadeOut(duration);
			}
		} 
	});
	jQuery(".back-to-top").click(function(event) {
		event.preventDefault();
		jQuery("html, body").animate({scrollTop: 0}, duration);
		return false;
	})
}

/*FINE BACK TO TOP*/

/*GESTIONE CALLBACK*/

function wg_CallBackRicalcolaCarrello(){
 	wg_AggiornaRigheCarrello();
	wg_AggiornaTotali();
}

function wg_CallBackCambioDatiTesta(){
	 wg_AggiornaRigheCarrello();
	 wg_AggiornaTotali();
}

function wg_CallbackAggiornaCarrello(response){
	data=response.Messaggio;
	if(typeof(data)=='object'){		
		valoricarrello=data.Records[0];
		var totale = parseFloat(valoricarrello.Totale_DOTE.replace(',','.'))*100;
		totale = Math.round(totale)/100;
		var content = '<div class="small-6 left"><label class="label  small-23">Articoli</label></div>' + 
									'<div class="small-6 left"><label class="label secondary small-23">' + valoricarrello.NumTotRighe_DOTE+ ' pezzi</label></div>' + 
									'<div class="small-6 left"><label class="label small-23">Totale</label></div>' + 
									'<div class="small-6 left"><label class="label secondary small-23">€ ' + totale  + '</label></div>'
		
		var htmlCar = '<div class="row">' + 
										'<div class="medium-24 large-3 text-right columns">' +
											'<i class="fa fa-shopping-cart cartHeader"></i>' + 
										'</div>' + 
										'<div class="medium-24 large-21 columns">' + 
											content +
										'</div>' +
									'</div>'							
		jQuery('#wg_Carrello').html(htmlCar).fadeIn('slow');
	}
}

/*param={
	CodLingua:'ITA'
}*/
function wg_CallBackGestioneLingua(param){
	location.reload(true);
}

/*param={
	CodCliente:'0001'
}*/
function wg_CallBackAttivaClienteAgente(param){
	location.href=location.href;
	//location.reload(true);
}

/*param={
	'CodArt':'0001'
}*/

function wg_CallBackInsArtCar(param){
	
	if(window.location.pathname.toLowerCase()== "/articolidettaglio.asp"){
		$('.wg_Articolo[data-articolo="' + param.CodArt + '"]').find('.wg_Qta').val('');		
	}else{
		$('.wg_Articolo[data-articolo="' + param.CodArt + '"]').addClass('wg_ArtSelected', 250).find('.wg_Qta').val('');	
	}
}
/*
param={
	tipoazione:AggiungiPreferito,
	selettore:iEl,
}
*/
function wg_CallBackClickPreferiti(param){
	if (param.tipoazione == 'AggiungiPreferito'){
		param.selettore.attr('title','Rimuovi dai Preferiti').switchClass('fa-heart-o', 'fa-heart', 1000);
	}
	else{
		param.selettore.attr('title','Aggiungi ai Preferiti').switchClass('fa-heart', 'fa-heart-o', 1000);
		if(window.location.pathname.toLowerCase()==fnglobalvariable.urlWgArticoliPreferitiAgente || window.location.pathname.toLowerCase()==fnglobalvariable.urlWgArticoliPreferitiCliente){
			param.selettore.parents('.wg_Articolo').remove();
			if ($('.wg_Articolo').length==0) location.reload(true);
		}
	}
}

/*
param={
	Elemento:$('.wg_DocumentoRighe').eq(0)
}
*/
function wg_CallbackEliminaRigaCarrello(param){
	wg_AvvisoClose();
	if($('.wg_DocumentoRighe[data-tipo="ART"]').length > 1){
			wg_CallBackRicalcolaCarrello();
	}
	else {
		location.reload(); 
	}
}


function wg_CallBackScriviOrdine(param){
	$('#loading').append('<div class="alert-box success radius text-center"><h2>Ordine creato correttamente <i class="fa fa-check-square-o"></i></h2></div>');
	if(wg_VerificaReg({Tipo:'AgeReg'})){
		urlredirect = '/AreaAgenti.asp?o=cr';
	}
	else if(wg_VerificaReg({Tipo:'CliReg'})){
		urlredirect = '/AreaClienti.asp?o=cr';	
	}		
	else{
		urlredirect='/default.asp';
	}				
	location.href = urlredirect;	
}

/*
param={
	rigasel:$('trsel'),
	idlista
}
*/
function wg_CallBackCaricaCarrello(param){
	$('#loading').append('<div class="alert-box success radius text-center"><h2>Preventivo caricato correttamente nel carrello <i class="fa fa-check-square-o"></i></h2></div>');
	location.href = '/carrello.asp';
}

/*
param={
	rigasel:$('trsel'),
	idlista
}
*/
function wg_CallBackListaRicerca(param){
	$('.wg_BoxListaRicerca[data-IdLista="' + param.idlista + '"] .wg_ValoreListaRicerca').val(param.rigasel.find('td').eq(1).text());
	$('.wg_BoxListaRicerca[data-IdLista="' + param.idlista + '"] .wg_DescrizioneListaRicerca').text(param.rigasel.find('td').eq(2).text());
}

/*
param={
	rigasel:$('trsel'),
	idlista
}
*/
function wg_CallBackListaRicercaAttivaCliente(param){
	wg_AttivaClienteAgente({
		valore:param.rigasel.find('td').eq(1).text()
	});
}

/*
param={
	rigasel:$('trsel'),
	idlista
}
*/
function wg_CallBackListaRicercaInsRapido(param){
	$('.wg_ClickLente').find('.wg_CodArticolo').val(param.rigasel.find('td').eq(1).text());
	$('.wg_ClickLente').find('.wg_Descrizione').val(param.rigasel.find('td').eq(2).text());
}

/*
param:{
	CodSede:'0001',
	Selettore:$(this)
}
*/
function wg_CallBackAttivaSede (param){
	wg_AvvisoClose();
	tipoAttivazione=(param.Selettore.hasClass('wg_GestDest'))?'wg_GestDest':'wg_GestDoc';
	$('#wg_TabellaGestioneSedi tr.wg_Sede[data-id != "' + param.CodSede + '"]').find('i.' + tipoAttivazione).switchClass('fa-check-square-o','fa-square-o');
	param.Selettore.switchClass('fa-square-o','fa-check-square-o');
} 

/*
param:{
	CodSede:'0001',
	Selettore:$(this)
}
*/
function wg_CallBackEliminaSede (param){
		 wg_AvvisoClose();
		$('#wg_TabellaGestioneSedi tr.wg_Sede[data-id = "' + param.CodSede + '"]').remove();
}

function wg_CallBackGestioneSede(param){
	 $('#AvvisoSede').foundation('reveal', 'close');
	if(window.location.pathname.toLowerCase()!=fnglobalvariable.urlWgCarrello){
	 location.reload();			
	}
	else{
		wg_AggiornaTestataCarrello();
		wg_AggiornaRigheCarrello();
		wg_RicalcolaCarrello();
	}
}

/*
param={
	selettore:categoriaSel,
	selettorearticoli : param.selettorearticoli,
	categoria :categoriaSel.parents('li').attr('id'),
}
*/
function wg_CallBackGestioneClickCategoria(param){
	if(param.selettore.find('.wg_Deseleziona').length==0){		
		wg_Loading();
		wg_AggiungiDeselezione({
			selettore:param.selettore	
		});
		wg_VisualizzaArticoli({
				CodCategoria:param.categoria,
				CodProduttore:$('#wg_ElencoProd .wg_ProdSelected').parents('li').attr('id'),
				Ordinamento:$('#wg_Ordinamento').val()
		});
		correggiUrl();
	}
}

/*
param={
selettore:$('.wg_Deseleziona')
}
*/
function wg_CallBackClickDeseleziona(param){
	div=param.selettore.parents('.descrizione');
	if(div.hasClass('wg_CatSelected')){
			div.removeClass('wg_CatSelected');
	}
	else{
			div.removeClass('wg_ProdSelected');
	}
	
	wg_VisualizzaArticoli({
		CodCategoria:$('#wg_ElencoCat .wg_CatSelected').parents('li').attr('id'),
		CodProduttore:$('#wg_ElencoProd .wg_ProdSelected').parents('li').attr('id'),
		Ordinamento:$('#wg_Ordinamento').val()
	});
	correggiUrl();
}



/*
param={
	numpagcorrart:2,
}
*/
function wg_CallBackGestionePaginazioneArticoli(param){
	wg_VisualizzaArticoli({
		numpagcorrart:param.numpagcorrart,
		CodCategoria:$('#wg_ElencoCat .wg_CatSelected').parents('li').attr('id'),
		CodProduttore:$('#wg_ElencoProd .wg_ProdSelected').parents('li').attr('id'),
		Ordinamento:$('#wg_Ordinamento').val(),
		wg_WhereAggiuntiva:$('#wg_WhereAggiuntiva').val()
	});
}


/*
param={
	selettore:,
	risposta
}
*/
function wg_CallBackVisualizzaArticoli(param){
	param.selettore.html(param.risposta).show('fold',function(){
		$(document).foundation('equalizer', 'reflow');
		wg_PosizionamentoImmaginiArticoli();
		if (wg_VerificaReg()) wg_VisualizzaPreferiti();
		wg_LoadingClose();	
	});		
}
	
/*
param={
	risposta:response
}
*/
function wg_CallBackMostraConfronto(param){
	wg_Avviso({
	 id:'wg_AvvisoConfronto',	
	 titolo:'Confronto Articoli',
	 responsive:true,
	 messaggio:param.risposta
	});
	
	if($('#wg_AvvisoConfronto').length==1 && wg_VerificaReg()){
			param={
			 selettorearticoli:'#wg_AvvisoConfronto'
			}
			wg_GestioneEventiPreferiti(param);
			wg_GestioneEventiInsArtCar(param);
			wg_VisualizzaPreferiti(param);
	}
}


/*param={
		selettore: $(this).parents('.wg_Articolo')
}*/
function wg_CallBackChiudiArtConfronto(param){
	param.selettore.fadeOut(700,function(){
			param.selettore.remove();
	});
	
}

/*
param={
 selettorearticoli : '#wg_ElencoArt',
}
*/
function wg_CallbackGestioneModVisualArticoli(param){
		wg_VisualizzaArticoli({
			  numpagcorrart:$('.NumPag:first b').text(),
				CodCategoria:$('#wg_ElencoCat .wg_CatSelected').parents('li').attr('id'),
				CodProduttore:$('#wg_ElencoProd .wg_ProdSelected').parents('li').attr('id'),
				Ordinamento:$('#wg_Ordinamento').val(),
				wg_WhereAggiuntiva:$('#wg_WhereAggiuntiva').val()
		});
}
	
/*
param={
	ordinamento:CodArticolo
}
*/	
function wg_CallBackGestioneOrdinamento(param){
	wg_VisualizzaArticoli({
			numpagcorrart:$('.NumPag:first b').text(),
			CodCategoria:$('#wg_ElencoCat .wg_CatSelected').parents('li').attr('id'),
			CodProduttore:$('#wg_ElencoProd .wg_ProdSelected').parents('li').attr('id'),
			Ordinamento:param.ordinamento,
			wg_WhereAggiuntiva:$('#wg_WhereAggiuntiva').val()
	});
}

/*
param={

}*/
function wg_CallBackGestioneRimozionePaginazione(param){
	wg_VisualizzaArticoli({
			NoPaginazione:true,
			CodCategoria:$('#wg_ElencoCat .wg_CatSelected').parents('li').attr('id'),
			CodProduttore:$('#wg_ElencoProd .wg_ProdSelected').parents('li').attr('id'),
			Ordinamento:$('#wg_Ordinamento').val(),
			wg_WhereAggiuntiva:$('#wg_WhereAggiuntiva').val()
	});	
}

/*
param={
	selettore:prodSel,
	selettorearticoli : param.selettorearticoli,
	produttore :idprod,
}
*/
function wg_CallBackGestioneClickProduttore(param){
	if(param.selettore.find('.wg_Deseleziona').length==0){		
		wg_AggiungiDeselezione({
			selettore:param.selettore	
		});
		wg_VisualizzaArticoli({
			CodCategoria:$('#wg_ElencoCat .wg_CatSelected').parents('li').attr('id'),
			CodProduttore:param.produttore,
			Ordinamento:$('#wg_Ordinamento').val(),
			wg_WhereAggiuntiva:$('#wg_WhereAggiuntiva').val()
		});
		correggiUrl();
	}
}
/*

/*
param={
	selezione:ui
}
*/
function wg_CallBackAutoCompletamento(param){
	var url=window.location.pathname.toLowerCase();
	switch(url){
	case '/carrello.asp':
		var element=$(param.elemento);
		var articolo=param.selezione.item.value.split(" | ");
		var codice=articolo[0];
		var descrizione=articolo[1];
		setTimeout(function(){element.val(codice)},1);
		element.parents('.wg_InsArticolo').find('.wg_Descrizione').val(descrizione);
		break;
	case '/clienti/clienti-inserimentorapido.asp':
		var element=$(param.elemento);
		var articolo=param.selezione.item.value.split(" | ");
		var codice=articolo[0];
		var descrizione=articolo[1];
		setTimeout(function(){element.val(codice)},1);
		element.parents('.wg_InsArticolo').find('.wg_Descrizione').val(descrizione);
		break;
	default:
	  if(wg_isSmall()){
			setTimeout(function(){$('#frmRicercaGlobalemobile').submit()},1)
		}
		else{
			setTimeout(function(){$('#frmRicercaGlobale').submit()},1)
		}
		
	}
} 

/*
param={
selettorearticoli
listapreferiti
}
*/
function wg_CallBackVisualizzaPreferiti(param){
	if (typeof(param.listapreferiti) == 'object'){
		data=param.listapreferiti;
		for (var i = 0; i< data.Records.length; i++){
			$(param.selettorearticoli).find('.wg_Articolo[data-articolo="'+ data.Records[i].CodArticolo_CAP +'"]').find('.wg_ArtPreferito i').attr('title','Rimuovi dai Preferiti').switchClass('fa-heart-o', 'fa-heart', 1000);
		}
	}
}

	
function wg_CallbackCambiaSession(param) {
	// nulla, per ora
}


function wg_CallBackGestioneVoucher(param){
	//wg_AggiornaTestataCarrello();
	wg_AggiornaRigheCarrello();
  wg_AggiornaGestioneVoucherCarrello();
	wg_RicalcolaCarrello();
}

/*
param={
	Elemento:$('.wg_Voucher').eq(0)
}
*/
function wg_CallbackEliminaVoucher(param){
	wg_AvvisoClose();
	wg_AggiornaRigheCarrello();
  wg_AggiornaGestioneVoucherCarrello();
	wg_AggiornaTotali();
	wg_RicalcolaCarrello();
}

/*
param={
idPreventivo
}
*/
function wg_CallBackAnnullaPreventivo(param){
 	location.reload(true);
}


/*
param{
	Messaggio:'Richiesta Inoltrata Correttamente',
	Errore
}
*/
function wg_CallBackRegistrazioneCliente(param){
	wg_Avviso({
		messaggio : param.Messaggio,
		titolo:'Registrazione Utente'
	});	
	
	/*setTimeout(function(){
	  location.href='/carrello.asp';
	},4000);*/
}


/*

*/
function wg_CallBackInserimentoRapido(param){
	var url=window.location.pathname.toLowerCase();
	switch(url){
	case '/carrello.asp':
		wg_CallBackRicalcolaCarrello();
	default:
		
	}
}

function wg_CallBackInserimentoMultiploArticoli(){
	
}


/*GESTIONE CALLBACK*/
function IscrizioneNewsletter(){
	wg_Avviso({
		id:'AvvisoIscrizione',
		titolo: ' ',
		responsive: true,
		messaggio : {
			url:'/Include/requestHTMLAjax.asp',
			variabili:{
				tipoHtml:'IscrizioneNewsletter'
			}
		}
	});
}

function correggiUrl() {
	
	var prod_id = 0;	
	var prod_name = '';	
	if ($('#wg_ElencoProd .wg_ProdSelected').length>0) {
		prod_id = $('#wg_ElencoProd .wg_ProdSelected').parents('li').attr('id');
		prod_name = $('#wg_ElencoProd .wg_ProdSelected').html();
		prod_name = strip_html(prod_name);
		prod_name = prod_name.trim();
	}
	
	var cat_id = 0;
	var cat_name = '';	
	if ($('#wg_ElencoCat .wg_CatSelected').length>0) {
		cat_id = $('#wg_ElencoCat .wg_CatSelected').parents('li').attr('id');
		cat_name = $('#wg_ElencoCat .wg_CatSelected').html();
		cat_name = strip_html(cat_name);
		cat_name = cat_name.trim();
	}
	
	var url = recuperaUrlGenerato(cat_id, prod_id);
	initialURL=url;
	history.pushState({ path: url }, null, url);
}

function recuperaUrlGenerato(cat_id, prod_id) {
	return $.ajax({
		type: "GET",
		url: '/Clienti/clienti-url-genera.asp?'
				+ "categoria=" + cat_id + "&"
				+ "produttore=" + prod_id
		,
		async: false
	}).responseText;
}

function strip_html(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

/* FUNCTION close alert footer */
function closeAlertFooter(){
	wg_ServerRequest({
		variabili : {
			typeRequest : 'setSessionAlert'
		},
		async:true,
		url:'/Templates/Request.asp'
	},
	function(response){
		$('#alertFooter').fadeOut('fast');
	});	
}
/* END FUNCTION close alert footer */

	
//function ScrollSection (elem) {
//	var url=window.location.pathname.toLowerCase();
//	if(url === "/Default.asp" || url === "/") {
//		hrefEl = $.attr(elem, 'href');
//		if(hrefEl!='/contatti.asp' && hrefEl!='/it/la-tradizione-caffè-molinari_000025.htm' && hrefEl!='https://www.facebook.com/espresso.xelecto' && hrefEl!='https://www.instagram.com/xelecto_/' && hrefEl!='https://www.youtube.com/channel/UC73cFfK-8MLIN4sNtZGRnbA'){
//			replacedHrefEl = hrefEl.replace('/','');
//			$('html, body').animate({
//				scrollTop: $( replacedHrefEl ).offset().top
//			}, 1000);
//		}else{
//			location.href = hrefEl;	
//		}
//	} else {
//		location.href = $(elem).attr('href');
//	}
//}
//
//function ScrollSectionMobile (elem) {
//	var url=window.location.pathname.toLowerCase();
//	if(url === "/Default.asp" || url === "/") {
//		hrefEl = $.attr(elem, 'href');
//		if(hrefEl!='/contatti.asp' && hrefEl!='/it/la-tradizione-caffè-molinari_000025.htm' && hrefEl!='https://www.facebook.com/espresso.xelecto' && hrefEl!='https://www.instagram.com/xelecto_/' && hrefEl!='https://www.youtube.com/channel/UC73cFfK-8MLIN4sNtZGRnbA'){
//			replacedHrefEl = hrefEl.replace('/','');
//			jQuery('.off-canvas-wrap').removeClass('move-right');
//			$('html, body').animate({
//				scrollTop: $(replacedHrefEl).offset().top
//			}, 1000);
//		}else{
//			location.href = hrefEl;	
//		}
//	} else {
//		location.href = $(elem).attr('href');
//	}
//}
