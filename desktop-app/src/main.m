#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface AppDelegate : NSObject <NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler, NSWindowDelegate>
@property (strong, nonatomic) NSWindow *window;
@property (strong, nonatomic) WKWebView *webView;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    // 1. Setup Window
    NSRect frame = NSMakeRect(100, 100, 1280, 860);
    NSWindowStyleMask styleMask = NSWindowStyleMaskTitled |
                                  NSWindowStyleMaskClosable |
                                  NSWindowStyleMaskMiniaturizable |
                                  NSWindowStyleMaskResizable;
    
    self.window = [[NSWindow alloc] initWithContentRect:frame
                                              styleMask:styleMask
                                                backing:NSBackingStoreBuffered
                                                  defer:NO];
    [self.window setFrameAutosaveName:@"AAFourthStepInventoryMainWindow"];
    [self.window setTitle:@"4th Step Moral Inventory — Alcoholics Anonymous"];
    [self.window setMinSize:NSMakeSize(900, 600)];
    [self.window setDelegate:self];
    [self.window center];
    
    // 2. Setup WebKit Configuration
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    WKUserContentController *userContentController = [[WKUserContentController alloc] init];
    [userContentController addScriptMessageHandler:self name:@"nativeApp"];
    config.userContentController = userContentController;
    
    // Preferences for local storage and file access
    WKPreferences *prefs = config.preferences;
    prefs.javaScriptCanOpenWindowsAutomatically = YES;
    [prefs setValue:@YES forKey:@"allowFileAccessFromFileURLs"];
    [config setValue:@YES forKey:@"allowUniversalAccessFromFileURLs"];
    
    // 3. Create WebView
    self.webView = [[WKWebView alloc] initWithFrame:frame configuration:config];
    self.webView.navigationDelegate = self;
    self.webView.UIDelegate = self;
    [self.webView setAutoresizingMask:(NSViewWidthSizable | NSViewHeightSizable)];
    
    [self.window setContentView:self.webView];
    [self buildNativeMenu];
    
    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
    
    // 4. Load local HTML bundle
    NSURL *bundleResourceURL = [[NSBundle mainBundle] resourceURL];
    NSURL *indexHTMLURL = [bundleResourceURL URLByAppendingPathComponent:@"web/index.html"];
    
    // Fallback if running outside app bundle in development
    if (![[NSFileManager defaultManager] fileExistsAtPath:[indexHTMLURL path]]) {
        indexHTMLURL = [bundleResourceURL URLByAppendingPathComponent:@"index.html"];
    }
    
    if ([[NSFileManager defaultManager] fileExistsAtPath:[indexHTMLURL path]]) {
        [self.webView loadFileURL:indexHTMLURL allowingReadAccessToURL:bundleResourceURL];
    } else {
        NSLog(@"Error: index.html not found at %@", indexHTMLURL);
        [self.webView loadHTMLString:@"<h1>Error: Application resources not found.</h1>" baseURL:nil];
    }
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return YES;
}

#pragma mark - Menu Bar Construction

- (void)buildNativeMenu {
    NSMenu *menubar = [[NSMenu alloc] init];
    
    // --- Application Menu ---
    NSMenuItem *appMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:appMenuItem];
    NSMenu *appMenu = [[NSMenu alloc] init];
    [appMenu addItemWithTitle:@"About 4th Step Moral Inventory" action:@selector(showAboutDialog:) keyEquivalent:@""];
    [appMenu addItem:[NSMenuItem separatorItem]];
    [appMenu addItemWithTitle:@"Preferences..." action:@selector(openPreferences:) keyEquivalent:@","];
    [appMenu addItem:[NSMenuItem separatorItem]];
    [appMenu addItemWithTitle:@"Hide 4th Step Inventory" action:@selector(hide:) keyEquivalent:@"h"];
    NSMenuItem *hideOthers = [appMenu addItemWithTitle:@"Hide Others" action:@selector(hideOtherApplications:) keyEquivalent:@"h"];
    [hideOthers setKeyEquivalentModifierMask:(NSEventModifierFlagOption | NSEventModifierFlagCommand)];
    [appMenu addItemWithTitle:@"Show All" action:@selector(unhideAllApplications:) keyEquivalent:@""];
    [appMenu addItem:[NSMenuItem separatorItem]];
    [appMenu addItemWithTitle:@"Quit 4th Step Inventory" action:@selector(terminate:) keyEquivalent:@"q"];
    [appMenuItem setSubmenu:appMenu];
    
    // --- File Menu ---
    NSMenuItem *fileMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:fileMenuItem];
    NSMenu *fileMenu = [[NSMenu alloc] initWithTitle:@"File"];
    [fileMenu addItemWithTitle:@"New Resentment..." action:@selector(newResentment:) keyEquivalent:@"n"];
    
    NSMenuItem *newFear = [fileMenu addItemWithTitle:@"New Fear..." action:@selector(newFear:) keyEquivalent:@"f"];
    [newFear setKeyEquivalentModifierMask:(NSEventModifierFlagShift | NSEventModifierFlagCommand)];
    
    NSMenuItem *newSex = [fileMenu addItemWithTitle:@"New Sex Conduct Entry..." action:@selector(newSexConduct:) keyEquivalent:@"s"];
    [newSex setKeyEquivalentModifierMask:(NSEventModifierFlagShift | NSEventModifierFlagCommand)];
    
    NSMenuItem *newHarm = [fileMenu addItemWithTitle:@"New Harm to Others..." action:@selector(newHarm:) keyEquivalent:@"h"];
    [newHarm setKeyEquivalentModifierMask:(NSEventModifierFlagShift | NSEventModifierFlagCommand)];
    
    [fileMenu addItem:[NSMenuItem separatorItem]];
    [fileMenu addItemWithTitle:@"Export Backup..." action:@selector(openExport:) keyEquivalent:@"e"];
    [fileMenu addItemWithTitle:@"Print / Save as PDF..." action:@selector(printDocument:) keyEquivalent:@"p"];
    [fileMenu addItem:[NSMenuItem separatorItem]];
    [fileMenu addItemWithTitle:@"Close Window" action:@selector(performClose:) keyEquivalent:@"w"];
    [fileMenuItem setSubmenu:fileMenu];
    
    // --- Edit Menu ---
    NSMenuItem *editMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:editMenuItem];
    NSMenu *editMenu = [[NSMenu alloc] initWithTitle:@"Edit"];
    [editMenu addItemWithTitle:@"Undo" action:@selector(undo:) keyEquivalent:@"z"];
    NSMenuItem *redo = [editMenu addItemWithTitle:@"Redo" action:@selector(redo:) keyEquivalent:@"z"];
    [redo setKeyEquivalentModifierMask:(NSEventModifierFlagShift | NSEventModifierFlagCommand)];
    [editMenu addItem:[NSMenuItem separatorItem]];
    [editMenu addItemWithTitle:@"Cut" action:@selector(cut:) keyEquivalent:@"x"];
    [editMenu addItemWithTitle:@"Copy" action:@selector(copy:) keyEquivalent:@"c"];
    [editMenu addItemWithTitle:@"Paste" action:@selector(paste:) keyEquivalent:@"v"];
    [editMenu addItemWithTitle:@"Select All" action:@selector(selectAll:) keyEquivalent:@"a"];
    [editMenuItem setSubmenu:editMenu];
    
    // --- View Menu ---
    NSMenuItem *viewMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:viewMenuItem];
    NSMenu *viewMenu = [[NSMenu alloc] initWithTitle:@"View"];
    [viewMenu addItemWithTitle:@"Reload Inventory" action:@selector(reloadPage:) keyEquivalent:@"r"];
    [viewMenu addItemWithTitle:@"Toggle Privacy Shield" action:@selector(togglePrivacy:) keyEquivalent:@"\e"];
    [viewMenu addItem:[NSMenuItem separatorItem]];
    [viewMenu addItemWithTitle:@"Actual Size" action:@selector(zoomActual:) keyEquivalent:@"0"];
    [viewMenu addItemWithTitle:@"Zoom In" action:@selector(zoomIn:) keyEquivalent:@"+"];
    [viewMenu addItemWithTitle:@"Zoom Out" action:@selector(zoomOut:) keyEquivalent:@"-"];
    [viewMenu addItem:[NSMenuItem separatorItem]];
    [viewMenu addItemWithTitle:@"Enter Full Screen" action:@selector(toggleFullScreen:) keyEquivalent:@"f"];
    [viewMenuItem setSubmenu:viewMenu];
    
    // --- Inventory Sections Menu ---
    NSMenuItem *invMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:invMenuItem];
    NSMenu *invMenu = [[NSMenu alloc] initWithTitle:@"Inventory"];
    [invMenu addItemWithTitle:@"1. Resentments (4 Columns)" action:@selector(gotoResentments:) keyEquivalent:@"1"];
    [invMenu addItemWithTitle:@"2. Fears Inventory" action:@selector(gotoFears:) keyEquivalent:@"2"];
    [invMenu addItemWithTitle:@"3. Sex Conduct & Relations" action:@selector(gotoSexConduct:) keyEquivalent:@"3"];
    [invMenu addItemWithTitle:@"4. Harms to Others" action:@selector(gotoHarms:) keyEquivalent:@"4"];
    [invMenu addItemWithTitle:@"5. Patterns & Defects Analysis" action:@selector(gotoPatterns:) keyEquivalent:@"5"];
    [invMenu addItemWithTitle:@"6. Step 5 Sponsor Packet" action:@selector(gotoStep5:) keyEquivalent:@"6"];
    [invMenu addItem:[NSMenuItem separatorItem]];
    [invMenu addItemWithTitle:@"7. Big Book Reference & Directions" action:@selector(gotoGuide:) keyEquivalent:@"7"];
    [invMenuItem setSubmenu:invMenu];
    
    // --- Window Menu ---
    NSMenuItem *windowMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:windowMenuItem];
    NSMenu *windowMenu = [[NSMenu alloc] initWithTitle:@"Window"];
    [windowMenu addItemWithTitle:@"Minimize" action:@selector(performMiniaturize:) keyEquivalent:@"m"];
    [windowMenu addItemWithTitle:@"Zoom" action:@selector(performZoom:) keyEquivalent:@""];
    [windowMenu addItem:[NSMenuItem separatorItem]];
    [windowMenu addItemWithTitle:@"Bring All to Front" action:@selector(arrangeInFront:) keyEquivalent:@""];
    [windowMenuItem setSubmenu:windowMenu];
    
    // --- Help Menu ---
    NSMenuItem *helpMenuItem = [[NSMenuItem alloc] init];
    [menubar addItem:helpMenuItem];
    NSMenu *helpMenu = [[NSMenu alloc] initWithTitle:@"Help"];
    [helpMenu addItemWithTitle:@"Big Book Chapter 5 Directions" action:@selector(gotoGuide:) keyEquivalent:@"?"];
    [helpMenu addItemWithTitle:@"Alcoholics Anonymous Official Website" action:@selector(openAAWebsite:) keyEquivalent:@""];
    [helpMenuItem setSubmenu:helpMenu];
    
    [NSApp setMainMenu:menubar];
}

#pragma mark - Menu Actions

- (void)showAboutDialog:(id)sender {
    NSAlert *alert = [[NSAlert alloc] init];
    alert.messageText = @"4th Step Moral Inventory";
    alert.informativeText = @"A private, searching, and fearless moral inventory application built strictly according to Chapter 5 ('How It Works', pp. 64-71) of the book Alcoholics Anonymous.\n\nVersion 1.0 - 100% Offline & Local-First.";
    alert.alertStyle = NSAlertStyleInformational;
    [alert runModal];
}

- (void)newResentment:(id)sender {
    [self.webView evaluateJavaScript:@"InventoryForms.openResentmentModal()" completionHandler:nil];
}

- (void)newFear:(id)sender {
    [self.webView evaluateJavaScript:@"InventoryForms.openFearModal()" completionHandler:nil];
}

- (void)newSexConduct:(id)sender {
    [self.webView evaluateJavaScript:@"InventoryForms.openSexConductModal()" completionHandler:nil];
}

- (void)newHarm:(id)sender {
    [self.webView evaluateJavaScript:@"InventoryForms.openHarmModal()" completionHandler:nil];
}

- (void)openExport:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.openExportModal()" completionHandler:nil];
}

- (void)openPreferences:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.openSecuritySettings()" completionHandler:nil];
}

- (void)togglePrivacy:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.togglePrivacyShield()" completionHandler:nil];
}

- (void)reloadPage:(id)sender {
    [self.webView reload];
}

- (void)zoomIn:(id)sender {
    self.webView.pageZoom += 0.1;
}

- (void)zoomOut:(id)sender {
    if (self.webView.pageZoom > 0.4) {
        self.webView.pageZoom -= 0.1;
    }
}

- (void)zoomActual:(id)sender {
    self.webView.pageZoom = 1.0;
}

- (void)gotoResentments:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('resentments')" completionHandler:nil];
}

- (void)gotoFears:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('fears')" completionHandler:nil];
}

- (void)gotoSexConduct:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('sexConduct')" completionHandler:nil];
}

- (void)gotoHarms:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('harms')" completionHandler:nil];
}

- (void)gotoPatterns:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('patterns')" completionHandler:nil];
}

- (void)gotoStep5:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('step5')" completionHandler:nil];
}

- (void)gotoGuide:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('guide')" completionHandler:nil];
}

- (void)openAAWebsite:(id)sender {
    [[NSWorkspace sharedWorkspace] openURL:[NSURL URLWithString:@"https://www.aa.org"]];
}

- (void)printDocument:(id)sender {
    [self.webView evaluateJavaScript:@"AppUI.switchTab('step5');" completionHandler:^(id result, NSError *error) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            NSPrintInfo *printInfo = [NSPrintInfo sharedPrintInfo];
            [printInfo setTopMargin:40.0];
            [printInfo setBottomMargin:40.0];
            [printInfo setLeftMargin:40.0];
            [printInfo setRightMargin:40.0];
            [printInfo setHorizontalPagination:NSPrintingPaginationModeFit];
            [printInfo setVerticalPagination:NSPrintingPaginationModeAutomatic];
            
            NSPrintOperation *op = [self.webView printOperationWithPrintInfo:printInfo];
            [op setShowsPrintPanel:YES];
            [op runOperationModalForWindow:self.window delegate:nil didRunSelector:NULL contextInfo:NULL];
        });
    }];
}

#pragma mark - WKScriptMessageHandler

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    if ([message.body isKindOfClass:[NSDictionary class]]) {
        NSDictionary *dict = (NSDictionary *)message.body;
        NSString *action = dict[@"action"];
        if ([action isEqualToString:@"print"]) {
            [self printDocument:nil];
        }
    }
}

#pragma mark - WKUIDelegate (Native Modal Dialogs)

- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))completionHandler {
    NSAlert *alert = [[NSAlert alloc] init];
    alert.messageText = @"4th Step Inventory";
    alert.informativeText = message;
    alert.alertStyle = NSAlertStyleInformational;
    [alert runModal];
    completionHandler();
}

- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL result))completionHandler {
    NSAlert *alert = [[NSAlert alloc] init];
    alert.messageText = @"4th Step Inventory";
    alert.informativeText = message;
    alert.alertStyle = NSAlertStyleWarning;
    [alert addButtonWithTitle:@"OK"];
    [alert addButtonWithTitle:@"Cancel"];
    NSModalResponse response = [alert runModal];
    completionHandler(response == NSAlertFirstButtonReturn);
}

- (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * _Nullable result))completionHandler {
    NSAlert *alert = [[NSAlert alloc] init];
    alert.messageText = @"4th Step Inventory";
    alert.informativeText = prompt;
    alert.alertStyle = NSAlertStyleInformational;
    
    NSTextField *input = [[NSTextField alloc] initWithFrame:NSMakeRect(0, 0, 260, 24)];
    input.stringValue = defaultText ?: @"";
    alert.accessoryView = input;
    
    [alert addButtonWithTitle:@"OK"];
    [alert addButtonWithTitle:@"Cancel"];
    
    NSModalResponse response = [alert runModal];
    if (response == NSAlertFirstButtonReturn) {
        completionHandler(input.stringValue);
    } else {
        completionHandler(nil);
    }
}

- (void)webView:(WKWebView *)webView runOpenPanelWithParameters:(WKOpenPanelParameters *)parameters initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSArray<NSURL *> * _Nullable URLs))completionHandler {
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.allowsMultipleSelection = parameters.allowsMultipleSelection;
    panel.canChooseDirectories = parameters.allowsDirectories;
    panel.canChooseFiles = YES;
    
    [panel beginWithCompletionHandler:^(NSModalResponse result) {
        if (result == NSModalResponseOK) {
            completionHandler(panel.URLs);
        } else {
            completionHandler(nil);
        }
    }];
}

@end

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSApplication *app = [NSApplication sharedApplication];
        [app setActivationPolicy:NSApplicationActivationPolicyRegular];
        
        static AppDelegate *delegate = nil;
        delegate = [[AppDelegate alloc] init];
        app.delegate = delegate;
        
        [app run];
    }
    return 0;
}
