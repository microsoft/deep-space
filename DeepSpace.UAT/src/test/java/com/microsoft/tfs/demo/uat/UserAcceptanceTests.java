package com.microsoft.tfs.demo.uat;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.concurrent.TimeUnit;

/**
 * Selenium-based User Acceptance Tests
 */
public class UserAcceptanceTests 
    extends TestCase
{
	private String siteUrl;
	private WebDriver driver;
    private WebDriver browser;
	
    public UserAcceptanceTests( String testName )
    {
        super( testName );
        
        this.driver = new HtmlUnitDriver(false);
        this.driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS);

        this.siteUrl = System.getenv("DEPLOYMENT_URL");
        if (this.siteUrl == null) {
        	this.siteUrl = "http://deepspace-test-vm.westus.cloudapp.azure.com/deepspace/#/stars";
        }
    }

    public static Test suite()
    {
        return new TestSuite(UserAcceptanceTests.class);
    }

    public void testTitle()
    {
    	this.driver.get(this.siteUrl);
    	String pageTitle = this.driver.getTitle();
    	assertEquals("Bootcamp Demo App", pageTitle);
    }
    
    //public void testDefaultSpeedText()
    //{
    //	driver.get(this.siteUrl);
    //    final WebElement element = this.driver.findElement(By.id("speedText"));
    //	assertNotNull(element);
    //    assertEquals(element.getText(), "50");
    //}
}
