package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class UseCase2TestCaseGoodPath {
	private static WebDriver driver;
	static String idValue;
	static String dirverPath;
	static WebDriverWait wait;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		wait = new WebDriverWait(driver, 30);
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}
	
	@Test
	public void useCase2TestCaseGoodPath()
	{
		driver.get("https://utilobot.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Enter our email and password
		email.sendKeys("magrawa4@ncsu.edu");
		pw.sendKeys("utilobot");
		
		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #mail-bot channel and wait for it to load.
		
		driver.get("https://utilobot.slack.com/messages/mailbot/");
		wait.until(ExpectedConditions.titleContains("mailbot"));
		
		WebElement mailBot = driver.findElement(By.id("msg_input"));
		assertNotNull(mailBot);
			
		Actions actions = new Actions(driver);
		actions.moveToElement(mailBot);
		actions.click();
		actions.sendKeys("git issue emails");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();
		
		WebElement msgsDiv = driver.findElement(By.xpath("//div[@id='msgs_div']"));
		List<WebElement> dayContainer = msgsDiv.findElements(By.xpath("//div[@class='day_container']"));
		WebElement todaysMsgsContainer = dayContainer.get(dayContainer.size()-1);
		WebElement msgsLabel = todaysMsgsContainer.findElement(By.xpath("//div[@class='day_divider_label']"));
		String labelText = msgsLabel.getText();
		System.out.println("Today messages label = " + labelText);
		
		
		if(labelText.contains("Today") == true){
			wait.withTimeout(20, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
			List<WebElement> todayMsgs = todaysMsgsContainer.findElements(By.xpath("//div[@class='day_msgs']/ts-message"));
			int totalMessages = todayMsgs.size();
			System.out.println("Total messages = " + totalMessages++);
			wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='day_msgs']/ts-message[" + totalMessages + "]")));
			
			todayMsgs = todaysMsgsContainer.findElements(By.xpath("//div[@class='day_msgs']/ts-message"));
			WebElement lastMsg = todayMsgs.get(totalMessages-1);
			String replyText = lastMsg.getText();
			System.out.println("Message text = " + replyText);

			String checkString = "Comments";
			int lastIndex = 0;
			int count = 0;

			while(lastIndex != -1){
			    lastIndex = replyText.indexOf(checkString,lastIndex);

			    if(lastIndex != -1){
			        count ++;
			        lastIndex += checkString.length();
			    }
			}
			
			assertTrue(replyText.contains(checkString));
			assertEquals(2, count);
			if(count == 2){
				actions.sendKeys("update issue with state=closed issue=9 repo=SE1 owner=asingh26");
				actions.sendKeys(Keys.RETURN);
				actions.build().perform();
				
				wait.withTimeout(20, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
				todayMsgs = todaysMsgsContainer.findElements(By.xpath("//div[@class='day_msgs']/ts-message"));
				totalMessages = todayMsgs.size();
				totalMessages++;
				wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='day_msgs']/ts-message[" + totalMessages + "]")));
				
				todayMsgs = todaysMsgsContainer.findElements(By.xpath("//div[@class='day_msgs']/ts-message"));
				lastMsg = todayMsgs.get(totalMessages-1);
				replyText = lastMsg.getText();
				System.out.println("Message text = " + replyText);

				checkString = "Given issue status has been updated successfully";
				assertTrue(replyText.contains(checkString));
				
				if(replyText.contains(checkString)){
					actions.sendKeys("add comment as \"description\" on issue with issue=9 repo=SE1 owner=asingh26");
					actions.sendKeys(Keys.RETURN);
					actions.build().perform();
					
					wait.withTimeout(20, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
					todayMsgs = todaysMsgsContainer.findElements(By.xpath("//div[@class='day_msgs']/ts-message"));
					totalMessages +=2;
					wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@class='day_msgs']/ts-message[" + totalMessages + "]")));
					
					todayMsgs = todaysMsgsContainer.findElements(By.xpath("//div[@class='day_msgs']/ts-message"));
					lastMsg = todayMsgs.get(totalMessages-1);
					replyText = lastMsg.getText();
					System.out.println("Message text = " + replyText);

					checkString = "Given comment has been added successfully";
					assertTrue(replyText.contains(checkString));
				}
			}
		}
	}
}
