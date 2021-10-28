import time

from framework import TestBase, Popup, TaskPage, BackgroundPage


class TestBasicFunctionality(TestBase):
    def setUp(self):
        super().setUp()

        self.popup = Popup(self.driver)
        self.task_one = TaskPage(self.driver, self.TASK_ONE_URL)
        self.task_two = TaskPage(self.driver, self.TASK_TWO_URL)
        self.background = BackgroundPage(self.driver)
        self.background.activate_premium()

        self.open_new_window()

    def test_extension_can_count(self):
        self.start_timer()
        time.sleep(0.5)
        self.task_one.solve_and_submit_task()

        self.assertEqual(1, self.popup.task_count)
