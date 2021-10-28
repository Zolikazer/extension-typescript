import time
from unittest import skip

from framework import Popup, TaskPage, InstructionPage, PremiumedTestBase


class TestPopup(PremiumedTestBase):

    def setUp(self):
        super().setUp()
        self.popup = Popup(self.driver)
        self.task_one = TaskPage(self.driver, self.TASK_ONE_URL)
        self.instruction_page = InstructionPage(self.driver)

    def tearDown(self):
        self.driver.quit()

    def test_measures_times(self):
        self.start_timer()
        time.sleep(65)

        self.assertEqual("00:01", self.popup.time)

    def test_measures_times_with_pauses(self):
        self.start_timer()
        time.sleep(65)
        self.stop_timer()

        time.sleep(60)
        self.start_timer()
        time.sleep(65)
        self.stop_timer()

        self.driver.refresh()
        self.assertEqual("00:02", self.popup.time)

    def test_press_reset(self):
        self.start_timer()
        time.sleep(65)

        self.popup.press_reset()
        time.sleep(0.5)
        self.assertEqual("00:00", self.popup.time)
        self.assertFalse(self.popup.is_counting)

    def test_extension_no_task_solved(self):
        self.assertEqual("No Task Solved", self.popup.current_task_title)

    def test_multiple_start(self):
        self.start_timer()
        time.sleep(65)
        self.start_timer()

        self.assertEqual("00:01", self.popup.time)

    def test_multiple_stop(self):
        self.start_timer()
        time.sleep(65)

        self.stop_timer()

        self.assertEqual("00:01", self.popup.time)

        self.stop_timer()

        self.assertEqual("00:01", self.popup.time)

    @skip
    def test_auto_stop(self):
        self.start_timer()
        self.driver.switch_to.window(self.driver.window_handles[-1])

        self.driver.get("https://google.com")
        self.driver.switch_to.window(self.driver.window_handles[0])

        time.sleep(1)
        self.assertEqual(False, self.popup.is_counting)
