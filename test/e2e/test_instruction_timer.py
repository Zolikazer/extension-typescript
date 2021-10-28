import time

from selenium.common.exceptions import NoSuchElementException

from framework import InstructionPage, SettingsPage, PremiumedTestBase


class TestInstructionTimer(PremiumedTestBase):
    def setUp(self):
        super().setUp()
        self.instruction_page = InstructionPage(self.driver)
        self.settings = SettingsPage(self.driver)

    def test_instruction_time_shows_up(self):
        self.instruction_page.visit()

        time.sleep(2)
        clock = self.driver.find_element_by_id("arrowex-timer")

        self.assertTrue("The timer was", clock.text)

    def test_instruction_time_not_shows_up_if_disabled(self):
        self.settings.toggle_instruction_timer()
        self.instruction_page.visit()

        time.sleep(2)

        with self.assertRaises(NoSuchElementException):
            self.driver.find_element_by_id("arrowex-timer")
