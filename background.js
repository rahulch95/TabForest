chrome.tabs.onCreated.addListener(function(tab){
	var rootPage;
	var rootRoot;
	var rootId = tab.id;

	chrome.storage.sync.get(["id", "rootPage", "rootRoot"], function(items){

		if(items.rootRoot){
			rootRoot = JSON.parse(items.rootRoot);
		}
		else {
			rootRoot = {};
		}

		if(items.rootPage){
			rootPage = JSON.parse(items.rootPage);
		}
		else {
			rootPage = {};
		}

		if(tab.url == "chrome://newtab/"){
			rootRoot[rootId.toString()] = null;
		}
		else {
			rootRoot[rootId.toString()] = tab.openerTabId;
		}
	
		rootPage[rootId.toString()] = null;

		chrome.storage.sync.set({"rootRoot": JSON.stringify(rootRoot)});
		chrome.storage.sync.set({"rootPage": JSON.stringify(rootPage)});
	});
	
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(changeInfo.status == "complete" && tab.url != tab.title){
		var id;
		var rootPage;
		var rootRoot;
		var pagePage;
		var rootId = tab.id;
		var pages;

		chrome.storage.sync.get(["id", "rootPage", "rootRoot", "pages", "pagePage"], function(items){

			if(items.id){
				id = items.id + 1;
			}
			else {
				id = 1;
			}
			chrome.storage.sync.set({"id": id});

			if(items.rootRoot){
				rootRoot = JSON.parse(items.rootRoot);
			}
			else {
				rootRoot = {};
			}

			if(items.rootPage){
				rootPage = JSON.parse(items.rootPage);
			}
			else {
				rootPage = {};
			}

			if(items.pagePage){
				pagePage = JSON.parse(items.pagePage);
			}
			else {
				pagePage = {};
			}

			var rootPageOrigin = rootPage[rootId.toString()];
			if(rootPageOrigin){
				pagePage[id.toString()] = rootPage[rootId.toString()];
			}
			else if(rootRoot[rootId.toString()]){
				pagePage[id.toString()] = rootPage[rootRoot[rootId.toString()].toString()];
			}
			else {
				pagePage[id.toString()] = null;
			}

			chrome.storage.sync.set({"pagePage": JSON.stringify(pagePage)});

			rootPage[rootId.toString()] = id;

			chrome.storage.sync.set({"rootPage": JSON.stringify(rootPage)});

			newPage = {
				id: id,
				rootId: rootId,
				name: tab.title,
				url: tab.url,
				startTime: new Date().getTime()
			}

			if(items.pages){
				pages = JSON.parse(items.pages);
			}
			else {
				pages = {}
			}

			pages[id.toString()] = newPage;
			chrome.storage.sync.set({"pages": JSON.stringify(pages)});
		});
	}
});