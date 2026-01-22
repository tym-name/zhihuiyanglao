<template>
    <el-card>
        <div>计划任务</div>
        <div class="cycle-tabs">
            <el-radio-group v-model="activeCycle" class="radio-group">
                <el-radio label="day" class="radio-item">日循环</el-radio>
                <el-radio label="week" class="radio-item">周循环</el-radio>
                <el-radio label="month" class="radio-item">月循环</el-radio>
            </el-radio-group>

            <!-- 对应的内容区域 -->
            <div class="tab-content">
                <div v-if="activeCycle === 'day'">
                    <div v-for="time in timeList" :key="time" class="time-item">
                        <div class="time-label">{{ time }}</div>
                        <div class="time-content">
                            <!-- 任务列表 -->
                            <div v-for="task in tasks[time]" :key="task.id"
                                :style="calculateTaskStyle(task, getHourFromTimeLabel(time))"
                                class="task-item-container">
                                <div class="task-content">
                                    <div>{{ task.serviceProject }}</div>
                                    <div>{{ task.timeRange }}</div>
                                </div>
                                <div class="task-delete" @click="deleteTask(task)">×</div>
                            </div>
                            <!-- 添加任务按钮 -->
                            <el-button type="primary" size="small" plain @click="addTask(time)">
                                + 添加任务
                            </el-button>
                        </div>
                    </div>
                </div>
                <div v-else-if="activeCycle === 'week'"><!-- 表头：星期几 -->
                    <div class="week-header">
                        <div class="time-label"></div>
                        <div class="week-day" v-for="weekDay in weekDays" :key="weekDay">{{ weekDay }}</div>
                    </div>
                    <!-- 时间行 -->
                    <div v-for="time in timeList" :key="time" class="time-item">
                        <div class="time-label">{{ time }}</div>
                        <!-- 每天的任务区域 -->
                        <div class="week-content">
                            <div v-for="weekDay in weekDays" :key="weekDay" class="week-day-cell">
                                <!-- 任务列表 -->
                                <div v-for="task in tasks[time + '-' + weekDay]" :key="task.id"
                                    :style="calculateTaskStyle(task, getHourFromTimeLabel(time))"
                                    class="task-item-container">
                                    <div class="task-content">
                                        <div>{{ task.serviceProject }}</div>
                                        <div>{{ task.timeRange }}</div>
                                    </div>
                                    <div class="task-delete" @click="deleteTask(task)">×</div>
                                </div>
                                <!-- 添加任务按钮 -->
                                <el-button type="primary" size="small" plain @click="addTask(time, weekDay)">
                                    + 添加任务
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else><!-- 分页标签 -->
                    <div class="month-pagination">
                        <el-button :type="currentMonthRange === 1 ? 'primary' : 'default'"
                            @click="switchMonthRange(1)">1-10号</el-button>
                        <el-button :type="currentMonthRange === 2 ? 'primary' : 'default'"
                            @click="switchMonthRange(2)">11-20号</el-button>
                        <el-button :type="currentMonthRange === 3 ? 'primary' : 'default'"
                            @click="switchMonthRange(3)">21-31号</el-button>
                    </div>
                    <!-- 表头：日期 -->
                    <div class="month-header">
                        <div class="time-label"></div>
                        <div class="month-day" v-for="day in monthDays" :key="day">{{ day }}号</div>
                    </div>
                    <!-- 时间行 -->
                    <div v-for="time in timeList" :key="time" class="time-item">
                        <div class="time-label">{{ time }}</div>
                        <!-- 每天的任务区域 -->
                        <div class="month-content">
                            <div v-for="day in monthDays" :key="day" class="month-day-cell">
                                <!-- 任务列表 -->
                                <div v-for="task in tasks[time + '-' + day]" :key="task.id"
                                    :style="calculateTaskStyle(task, getHourFromTimeLabel(time))"
                                    class="task-item-container">
                                    <div class="task-content">
                                        <div>{{ task.serviceProject }}</div>
                                        <div>{{ task.timeRange }}</div>
                                    </div>
                                    <div class="task-delete" @click="deleteTask(task)">×</div>
                                </div>
                                <!-- 添加任务按钮   -->
                                <el-button type="primary" size="small" plain @click="addTask(time, day)">
                                    + 添加任务
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 添加任务对话框 -->
            <el-dialog v-model="dialogVisible" title="添加任务" width="500px">
                <el-form :model="formData" :inline="true">
                    <el-form-item label="服务项目" required>
                        <el-select v-model="formData.serviceProject" placeholder="请选择服务项目" style="width: 400px">
                            <el-option :label="item.name" :value="item.id" v-for="item in ServiceList" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="任务时间" required>
                        <div class="task-time-container">
                            <el-time-picker v-model="formData.time" is-range range-separator="To"
                                start-placeholder="开始时间" end-placeholder="结束时间" style="width: 340px"
                                value-format="HH:mm" format="HH:mm" />
                        </div>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleConfirm">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </el-card>
</template>

<script setup lang='ts'>
import { elderlyTaskAdd, elderlyTaskDelete, elderlyTaskGetTask, nursingServiceList } from '@/api/market/elderly';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router';

const activeCycle = ref('day') // 默认选中日循环

/// 时间列表
const timeList = ref([
    '上午00时', '上午01时', '上午02时', '上午03时',
    '上午04时', '上午05时', '上午06时', '上午07时',
    '上午08时', '上午09时', '上午10时', '上午11时',
    '下午12时', '下午13时', '下午14时', '下午15时',
    '下午16时', '下午17时', '下午18时', '下午19时',
    '下午20时', '下午21时', '下午22时', '下午23时'
]);

// 星期列表
const weekDays = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);

// 月日期列表
const monthDays = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// 当前月份范围
const currentMonthRange = ref(1); // 1-10号: 1, 11-20号: 2, 21-31号: 3
const ServiceList = ref<any>([])

// 路由对象
const route = useRoute();
// 老人ID
const elderlyId = ref<number>(0);

// 定义任务数据类型
interface Task {
    id: string;
    serviceProject: string;
    timeRange: string;
    startTime: string;
    endTime: string;
    startHour: number;
    endHour: number;
    startMinute: number;
    endMinute: number;
    duration: number;
}

interface TaskMap {
    [key: string]: Task[];
}

// 对话框显示控制
const dialogVisible = ref(false);

// 表单数据
interface FormData {
    serviceProject: string;
    time: [string | null, string | null];
    startTime: string
    endTime: string
}

const formData = reactive<FormData>({
    serviceProject: '',
    time: [null, null],
    startTime: '',
    endTime: ''
});

// 当前操作的时间和日期信息
const currentTime = ref('');
const currentDay = ref<string | number | undefined>(undefined);

// 时间标签到小时的映射函数
const getHourFromTimeLabel = (timeLabel: string): number => {
    // 提取数字部分并转换为小时，添加空值检查
    const matchResult = timeLabel.match(/\d+/);
    if (!matchResult) {
        return 0;
    }
    const hourStr = matchResult[0];
    return parseInt(hourStr, 10);
};

// 小时到时间标签的映射函数
const getTimeLabelFromHour = (hour: number): string => {
    if (hour >= 0 && hour < 12) {
        return `上午${hour.toString().padStart(2, '0')}时`;
    } else {
        return `下午${hour.toString().padStart(2, '0')}时`;
    }
};

// 任务数据
const tasks = reactive<TaskMap>({
    // 初始化每个时间点的任务列表为空数组
});

// 初始化任务数据
for (const time of timeList.value) {
    tasks[time] = [];

    // 初始化周循环任务数据
    for (const weekDay of weekDays.value) {
        tasks[`${time}-${weekDay}`] = [];
    }

    // 初始化月循环任务数据 (1-31号)
    for (let day = 1; day <= 31; day++) {
        tasks[`${time}-${day}`] = [];
    }
};

// 计算任务样式
const calculateTaskStyle = (task: Task, currentHour: number) => {
    // 计算任务开始时间在当前小时内的偏移量（分钟）
    const startOffset = (task.startHour - currentHour) * 60 + task.startMinute;
    // 计算任务总时长（分钟）
    const totalDuration = (task.endHour - task.startHour) * 60 + (task.endMinute - task.startMinute);
    // 计算任务高度（每个小时60px，每分钟1px）
    const height = totalDuration + 'px';
    // 计算任务顶部偏移量
    const top = startOffset + 'px';
    return {
            height,
            top,
            position: 'absolute' as 'absolute',
            left: '5px',
            right: '5px',
            backgroundColor: '#409eff',
            color: 'white',
            borderRadius: '4px',
            padding: '5px',
            fontSize: '12px',
            textAlign: 'center' as const,
            zIndex: 2,
            cursor: 'pointer'
        };
};

// 月份范围切换函数
const switchMonthRange = (range: number) => {
    currentMonthRange.value = range;

    // 更新显示的日期范围
    if (range === 1) {
        monthDays.value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else if (range === 2) {
        monthDays.value = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    } else if (range === 3) {
        monthDays.value = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    }
};

// 添加任务
const addTask = async (time: string, day?: string | number) => {
    // 保存当前时间和日期信息
    currentTime.value = time;
    currentDay.value = day;

    // 重置表单数据
    formData.serviceProject = '';
    formData.time = [null, null];

    // 打开对话框
    dialogVisible.value = true;

};
onMounted(async () => {
    let Service = ref({
        page: 1,
        pageSize: 1000
    })
    let res = await nursingServiceList(Service.value)
    ServiceList.value = res.data.list
    getelderlyTask()
})

// 处理确定按钮点击
const handleConfirm = async () => {
    // 简单验证表单数据
    if (!formData.serviceProject) {
        ElMessage.warning('请选择服务项目');
        return;
    }

    if (!formData.time[0]) {
        ElMessage.warning('请选择开始时间');
        return;
    }

    if (!formData.time[1]) {
        ElMessage.warning('请选择结束时间');
        return;
    }

    // Parse HH:mm strings to get hours and minutes
    const parseTimeString = (timeStr: string): { hour: number; minute: number } => {
        const [hour, minute] = timeStr.split(':').map(Number);
        return { hour, minute };
    };

    const startTime = parseTimeString(formData.time[0]);
    const endTime = parseTimeString(formData.time[1]);

    // Validate time range
    if (startTime.hour > endTime.hour || (startTime.hour === endTime.hour && startTime.minute > endTime.minute)) {
        ElMessage.warning('开始时间不能晚于结束时间');
        return;
    }

    try {
        // 准备请求数据
        const requestData = {
            day: "",
            elderlyId: elderlyId.value,
            endTime: formData.time[1],
            serviceId: formData.serviceProject,
            startTime: formData.time[0],
            time: [
                new Date().toISOString(),
                new Date().toISOString()
            ],
            //   type: cycleType.value,
            //   week: cycleType.value === '周循环' ? currentDay.value : (cycleType.value === '月循环' ? currentDay.value + '号' : 'task')
        };

        // 调用添加任务接口
        let res = await elderlyTaskAdd(requestData);
        console.log('添加任务结果:', res);

        // 关闭对话框
        dialogVisible.value = false;

        // 刷新任务列表
        await getelderlyTask();

        // 显示成功消息
        ElMessage.success('任务添加成功');
    } catch (error) {
        console.error('添加任务失败:', error);
        ElMessage.error('添加任务失败');
    }
};

// 删除任务
const deleteTask = async (task: Task) => {
    try {
        // 确认删除
        await ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });



        await elderlyTaskDelete(Number(task.id));
        ElMessage.success('任务删除成功');

        // 刷新任务列表
        await getelderlyTask();
    } catch (error) {
        if (error !== 'cancel') {
            console.error('删除任务失败:', error);
            ElMessage.error('删除任务失败');
        }
    }
};

const getelderlyTask = async () => {
    try {
        elderlyId.value = Number(route.query.id);
        let res = await elderlyTaskGetTask(elderlyId.value);

        // 清空现有任务
        for (const time of timeList.value) {
            tasks[time] = [];

            // 清空周循环任务数据
            for (const weekDay of weekDays.value) {
                tasks[`${time}-${weekDay}`] = [];
            }

            // 清空月循环任务数据 (1-31号)
            for (let day = 1; day <= 31; day++) {
                tasks[`${time}-${day}`] = [];
            }
        }

        // 解析接口返回的数据并添加到tasks对象中
        res.data.list.forEach((taskData: any) => {
            // Parse HH:mm:ss strings to get hours and minutes
            const parseTimeString = (timeStr: string): { hour: number; minute: number } => {
                const [hour, minute] = timeStr.split(':').slice(0, 2).map(Number);
                return { hour, minute };
            };

            const startTime = parseTimeString(taskData.startTime);
            const endTime = parseTimeString(taskData.endTime);

            // 格式化任务时间范围（只显示HH:mm）
            const formatTime = (timeStr: string): string => {
                return timeStr.slice(0, 5);
            };
            const formattedStartTime = formatTime(taskData.startTime);
            const formattedEndTime = formatTime(taskData.endTime);
            const timeRange = `${formattedStartTime}-${formattedEndTime}`;

            // 创建完整的Task对象
            const task: Task = {
                id: taskData.id.toString(),
                serviceProject: taskData.serviceName,
                timeRange,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                startHour: startTime.hour,
                endHour: endTime.hour,
                startMinute: startTime.minute,
                endMinute: endTime.minute,
                duration: (endTime.hour - startTime.hour) * 60 + (endTime.minute - startTime.minute)
            };

            // 根据循环类型和日期计算所有受影响的时间段
            for (let hour = startTime.hour; hour <= endTime.hour; hour++) {
                // 获取对应的时间标签
                const timeLabel = getTimeLabelFromHour(hour);

                // 根据循环类型生成任务键
                let key = '';
                if (taskData.type === '日循环') {
                    // 日循环：只需要时间标签
                    key = timeLabel;
                } else if (taskData.type === '周循环') {
                    // 周循环：需要时间标签 + 星期几
                    key = `${timeLabel}-${taskData.week}`;
                } else if (taskData.type === '月循环') {
                    // 月循环：需要时间标签 + 日期（解析week字段中的日期，如"15号"）
                    let day = 1;
                    if (taskData.week && taskData.week.includes('号')) {
                        day = parseInt(taskData.week.replace('号', ''));
                    } else if (typeof taskData.day === 'string' && taskData.day) {
                        day = parseInt(taskData.day);
                    }
                    key = `${timeLabel}-${day}`;
                }
                // 添加任务到对应时间段
                if (tasks[key]) {
                    tasks[key].push(task);
                }
            }
        });
    } catch (error) {
        console.error('获取老人任务数据失败:', error);
        ElMessage.error('获取老人任务数据失败');
    }
}
</script>

<style scoped lang='less'>
@import url('../../assets/less/schedule/shcedule.less');
</style>