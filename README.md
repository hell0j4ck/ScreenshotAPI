<b>NOTE: Incase of a chrome browser not found ERROR. Add the following line of code to a puppeteer.config.cjs file and npm uninstall then npm install puppeteer. You should be able to see the new .cache folder generated in the root directory. Now the cache directory is officially changed and there should be no problem running the app.</b>  <br><br>
<b>I've Already Included The Below Code Is In The Application So You Don't Have To.</b>

const {join} = require('path');

<p>
  /**<br>
 * @type {import("puppeteer").Configuration}<br>
 */<br>
module.exports = {  <br>
  // Changes the cache location for Puppeteer.  <br>
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),  <br>
};  <br>
</p>




<h1>INSTRUCTIONS</h1>

Puppetteer by default installs the headless browser in the local user profile instead of in the root directory, which causes the error of "Browser not found" in some deployments. The code above when saved as puppeteer.config.cjs forces puppeteer to install the headless browser in the root directory of the application.

It is IMPORTANT TO NOTE that before deployment, the node_modules folder and .cache folder must be deleted.

The reason being, the .cache folder is large in size and contains files/executables that in my experience cannot be uploaded to the repository. 

If you upload the code WITHOUT the .cache folder while the node_modules folder is still there, running NPM INSTALL does NOT reinstall the browser (This is a glitch with puppetteer), that is why once you delete both folders, NPM INSTALL will reinstall the node_modules and .cache files upon deployment.

If you remove the .cache folder while the node_modules folder is still there, you can reinstall the browser by running the Install Browser .cache Folder.bat script or Install Browser.bat batch scripts included in the application.

However, since most serverless application deployment platforms like Render, FlyIO, or Lambda does not give you the option to go in and run the Install Browser .cache Folder.bat manually, removing both folders will ensure that everything gets installed the way they should by simply running NPM INSTALL.


<h2>Starting The Server</h2>

<p>For local testing before deploying, simply run the NPM Install Batch File followed by the Start Server batch file</p>
<br>

<img src="https://github.com/hell0j4ck/ScreenshotAPI/assets/71343643/3d5a93cb-3ac4-4161-95d1-af999e9ca3dd">

<h2>Screenshot Request</h2>

<p>For screenshots, you will use the <b>/screenshot</b> route followed by the query string <b>url</b> containing your url</p>
<br>

<img src="https://github.com/hell0j4ck/ScreenshotAPI/assets/71343643/0567a37e-d166-4f1d-905b-29ad11f06b5f">
<img src="https://github.com/hell0j4ck/ScreenshotAPI/assets/71343643/e4b17211-dc5e-4f17-bb20-b45d0aeaac92">

<h2>PDF Request</h2>

<p>For PDFs, you will use the <b>/pdf</b> route followed by the query string <b>url</b> containing your url</p>
<br>

<img src="https://github.com/hell0j4ck/ScreenshotAPI/assets/71343643/a05de586-1cce-42f5-80e8-e1ec2875ca6b">
<img src="https://github.com/hell0j4ck/ScreenshotAPI/assets/71343643/6500587c-787a-418d-a6b3-842fc4696f3f">




<h1>LINUX Instructions</h1>

<p>You may run into issues deploying on a linux machine, and the documentation to solve those issues are below</p>

<h2>Error: UnhandledPromiseRejectionWarning: Error: Failed to launch the browser process! error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory. </h2>

<h3>Solution</h3>

<p>This mostly but not all the time is caused by missing dependencies that are required in the latest version. The good thing is you can easily check the missing chrome dependencies causing the crash.</p><br>


<p>Make sure you are in the root folder of your project<br>

-Navigate to node_modules folder<br>
-Navigate to .cache/puppeteer/chrome/linux-some number/chrome-linux<br>
-replace the linux-some number with whatever ls will output<br>
-ls at /.local-chromium to check name of your directory<br>
-At the last directory [ chrome-linux ] run below command to check the missing dependencies<br></p>

<h4>ldd chrome | grep not</h4><br>

<p>If you see any missing dependencies, run this command to install everything and restart your application.</p><br>


<h4>sudo apt-get install ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils</h4><br>



<b><p>NOTE: You will need to run this using a local user and NOT ROOT because there's a bug with the --no-sandbox error whenever root is used to run the app.<p></b><br>


<h3>Create a new local user while you are logged in as root by running the following command:</h3><br>

<h4>adduser [username]</h4><br>

<h3>Then proceed to enter the password for the user. If you are not asked the password, then execute the command:</h4><br>

<h4>passwd [username]</h4><br>


<h3>Next, add the newly created user to the list of sudoers by executing the following command:</h3><br>

<h4>usermod -aG sudo [username]</h4><br>


<h3>Next, switch over to the user's localhost by executing the following command:</h3><br>

<h4>su -l [username]</h4><br>


<b><p>Now it is important to change the ownership of the ScreenshotAPI folder, especially the ScreenshotAPI/screenshots and ScreenshotAPI/pdfs folder because we will get an EACCESS denied error when a request for a screenshot or pdf is sent.</p></b><br>

<h3>First run the command:</h3><br>

<h4>sudo npm install -g --unsafe-perm=true --allow-root</h4><br>


<h3>Then run the following commands:</h3><br>

<h4>sudo chown -R [username] /ScreenshotAPI</h4><br>
<h4>sudo chown -R [username] /ScreenshotAPI/screenshots</h4><br>
<h4>sudo chown -R [username] /ScreenshotAPI/pdfs</h4><br>




<b><p>NOTE: If you still get any errors related to --no-sandbox, change the browser instance in the const browser in index.js to the following:</p></b><br>

<h3>Super Important Critical Step</h3>

<h4>const browser = await puppeteer.launch({headless:"new", args: ['--no-sandbox', '--disable-setuid-sandbox'],});</h4><br>

<p>This basically adds the --no-sandbox argument to puppetteer. </p>

