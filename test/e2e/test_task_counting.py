import time
from unittest import skip

from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys

from framework import TaskPage, Popup, TestBase


class TestTaskCounting(TestBase):

    def setUp(self):
        super().setUp()

        self.popup = Popup(self.driver)
        self.task_one = TaskPage(self.driver, self.TASK_ONE_URL)
        self.task_two = TaskPage(self.driver, self.TASK_TWO_URL)

        self.open_new_window()

    def tearDown(self):
        self.driver.quit()

    def test_count_tasks(self):
        self.start_timer()
        time.sleep(0.5)
        for _ in range(10):
            self.task_one.solve_and_submit_task()
            time.sleep(1)

        self.assertEqual(10, self.popup.task_count)

    def test_average_time_spent_on_task(self):
        self.start_timer()
        for _ in range(3):
            time.sleep(5)
            self.task_one.solve_and_submit_task()

        self.assertEqual(5, self.popup.rph)

    def test_can_count_multiple_task(self):
        self.start_timer()
        time.sleep(0.5)
        self.task_one.solve_and_submit_task()
        self.task_two.solve_and_submit_task()

        self.assertEqual(2, self.popup.task_count)

    def test_popup_displays_current_task(self):
        self.start_timer()
        time.sleep(0.5)
        self.task_one.solve_and_submit_task()

        current_task = self.popup.current_task
        self.assertEqual(self.task_one.task_title, current_task.task_name)

        self.task_two.solve_and_submit_task()
        current_task = self.popup.current_task
        self.assertEqual(self.task_two.task_title, current_task.task_name)

    def test_current_task_stat_should_render(self):
        self.start_timer()
        time.sleep(0.5)
        number_of_task_to_solve = 25
        for i in range(number_of_task_to_solve):
            self.task_one.solve_and_submit_task()
            time.sleep(5)

        current_task = self.popup.current_task
        self.assertEqual(number_of_task_to_solve, current_task.task_count)
        self.assertTrue(4 <= current_task.rph <= 6)
        self.assertEqual(2, current_task.time)

    @skip
    def test_extension_should_alert_when_not_started(self):
        self.task_one.solve_and_submit_task()

        self.assertTrue(self.task_one.is_alert_showed())

    def test_task_should_be_counted_with_ctrl_enter(self):
        self.start_timer()
        time.sleep(0.5)
        self.task_one.solve_task()

        ActionChains(self.driver).key_down(Keys.CONTROL).key_down(Keys.ENTER).key_up(Keys.ENTER).key_up(
            Keys.CONTROL).perform()

        self.assertEqual(1, self.popup.task_count)

    @skip
    def test_task_should_not_be_counted_with_ctrl_enter_if_task_is_not_solved(self):
        self.start_timer()
        time.sleep(0.5)

        ActionChains(self.driver).key_down(Keys.CONTROL).key_down(Keys.ENTER).key_up(Keys.CONTROL).key_up(
            Keys.ENTER).perform()

        self.assertEqual(0, self.popup.task_count)
