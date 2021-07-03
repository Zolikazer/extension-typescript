import os
import time
from abc import ABC
from unittest import TestCase

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.select import Select

EXTENSION_ID = "llocmlefjjpeaijfmkhliikmikngfmmi"


def convert_path(path):
    return os.path.join(os.path.dirname(os.path.realpath(__file__)), path)


EXTENSION_PATH = "chrome-extension://" + EXTENSION_ID


class TestBase(TestCase):
    EXTENSION_EXECUTABLE_PATH = convert_path("../../extension/extension.zip")

    TASK_ONE_URL = "file://" + convert_path("resources/website/task_1.html")
    TASK_TWO_URL = "file://" + convert_path("resources/website/task_2.html")

    def setUp(self):
        self.driver = self.make_driver()
        self.open_new_window()

    @staticmethod
    def make_driver():
        options = Options()
        options.add_extension(TestBase.EXTENSION_EXECUTABLE_PATH)
        # options.add_argument("--headless")
        options.add_argument("--mute-audio")
        driver = webdriver.Chrome(os.path.join(os.path.dirname(os.path.realpath(__file__)),
                                               "resources/chromedriver"), options=options)

        return driver

    def open_new_window(self):
        self.driver.execute_script("window.open('', 'new_window')")
        self.driver.switch_to.window(self.driver.window_handles[-1])

    def start_timer(self):
        self.task_one.visit()

    def stop_timer(self):
        self.instruction_page.visit()


class BasePage(ABC):
    def __init__(self, driver, url):
        self.error_locator = "error"
        self.driver = driver
        self.url = url

    def visit(self):
        self.driver.get(self.url)

    def find(self, locator):
        return self.driver.find_element_by_id(locator)

    def click(self, locator):
        self.find(locator).click()

    def type(self, locator, input_text):
        self.find(locator).send_keys(input_text)

    def select(self, dropdown_locator, text):
        select = Select(self.find(dropdown_locator))
        select.select_by_visible_text(text)

    def clear(self, locator):
        self.driver.find_element_by_id(locator).clear()

    def alert(self, locator):
        try:
            self.find(locator)
            return True
        except NoSuchElementException:
            return False

    def fail(self):
        return self.alert(self.error_locator)


class ExtensionPage(BasePage, ABC):
    def __init__(self, driver, url):
        super().__init__(driver, url)

    def visit(self):
        self._switch_to_extension()
        super().visit()

    def _switch_to_extension(self):
        self.driver.switch_to.window(self.driver.window_handles[0])


class EwoqPage(BasePage, ABC):
    def __init__(self, driver, url):
        super().__init__(driver, url)

    def visit(self):
        self._switch_to_ewoq()
        super().visit()

    def _switch_to_ewoq(self):
        self.driver.switch_to.window(self.driver.window_handles[-1])


class Popup(ExtensionPage):
    def __init__(self, driver):
        super().__init__(driver, EXTENSION_PATH + "/view/popup/popup.html")

    @property
    def time(self):
        self.visit()
        return self.find("worked-time").text

    @property
    def task_count(self):
        self.visit()
        return int(self.find("task-count").text)

    @property
    def rph(self):
        self.visit()
        return int(self.find("rph").text.split()[0])

    @property
    def current_task_title(self):
        self.visit()
        return self.find("current-task").text

    @property
    def current_task(self):
        self.visit()
        return Task(self.find("current-task").text.split("\n")[0],
                    self.find("current-task").text.split("\n")[1])

    @property
    def is_counting(self):
        self.visit()
        counting = self.find("counting-status")
        if counting.text == "Counting":
            return True

        return False

    def press_stop(self):
        self.visit()
        self.click("stop-btn")

    def press_reset(self):
        self.visit()
        self.click("reset-btn")

    def press_start(self):
        self.visit()
        self.click("start-btn")


class TaskPage(EwoqPage):
    def __init__(self, driver, url):
        super().__init__(driver, url)

    @property
    def task_title(self):
        self.visit()
        return self.find("task").text

    def is_alert_showed(self):
        try:
            self.driver.switch_to_alert()
            return True

        except Exception:
            return False

    def solve_and_submit_task(self):
        self.solve_task()
        self.click("submit")

    def solve_task(self):
        self.visit()
        self.click("solve-task-btn")


class Task:
    def __init__(self, task_name, task_stat_string):
        self.task_name = task_name
        self.task_count = int(task_stat_string.split()[1])
        self.rph = int(task_stat_string.split()[6])
        self.time = int(task_stat_string.split()[3])


class TasksPage(EwoqPage):

    def __init__(self, driver):
        super().__init__(driver, EXTENSION_PATH + "/tasks")

    def get_task_by_name(self):
        pass


class SettingsPage(EwoqPage):
    AUTO_STOP = "auto-stop"
    INSTRUCTION_TIMER = "instruction-time-enabled"

    def __init__(self, driver):
        super().__init__(driver, EXTENSION_PATH + "/view/settings/settings.html")

    @property
    def warn_checked(self):
        self.visit()
        return self.find("submit-warn").is_selected()

    @property
    def payrate(self):
        self.visit()
        return int(self.find("payrate").get_property("value"))

    @property
    def currency(self):
        self.visit()
        return self.find("currencies").text

    @property
    def auto_stop_checked(self):
        self.visit()
        return self.find(self.AUTO_STOP).is_selected()

    def toggle_warn(self):
        self.visit()
        self.find("submit-warn").click()
        self.save_settings()

    def save_settings(self):
        self.find("save-btn").click()

    def set_payrate(self, payrate):
        self.visit()
        self.find("payrate").clear()
        self.find("payrate").send_keys(payrate)
        self.save_settings()
        time.sleep(3)

    def toggle_auto_stop(self):
        self.visit()
        self.find(self.AUTO_STOP).click()
        self.save_settings()

    def toggle_instruction_timer(self):
        self.visit()
        self.find(self.INSTRUCTION_TIMER).click()
        self.save_settings()


class InstructionPage(EwoqPage):
    def __init__(self, driver):
        super().__init__(driver, "file://" + convert_path("resources/website/instruction.html"))
        self.driver = driver
